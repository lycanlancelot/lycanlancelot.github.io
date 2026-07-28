#!/usr/bin/env python3
"""Validate _data/projects.yml against the schema projects.html and index.html expect.

Run after editing project content:

    python3 script/validate-projects.py

Lives in script/ deliberately — .github/workflows/ci.yml triggers on `data/**`,
so anything placed there would fire the Cloudflare Worker CI on every content edit.
"""
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "_data" / "projects.yml"
CATEGORIES = ROOT / "_data" / "project_categories.yml"

REQUIRED = ["id", "name", "tagline", "kicker", "category", "kind", "status",
            "year", "highlight", "featured", "tech", "description", "features"]
KINDS = {"repo", "case-study", "enablement"}
STATUSES = {"active", "2025", "2026", "contrib", "case-study", "workshop"}
# Must stay in sync with TOPIC_COLORS in projects.html.
TOPICS = {"rag", "agents", "embeddings", "finetune", "applied"}

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def walk_strings(node, path=""):
    """Yield (path, string) for every string anywhere in the structure."""
    if isinstance(node, str):
        yield path, node
    elif isinstance(node, dict):
        for k, v in node.items():
            yield from walk_strings(v, f"{path}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from walk_strings(v, f"{path}[{i}]")


def main():
    projects = yaml.safe_load(PROJECTS.read_text())
    categories = yaml.safe_load(CATEGORIES.read_text())

    # Rule 1 from the projects.yml header: must be a sequence, not a hash.
    if not isinstance(projects, list):
        sys.exit(f"FATAL: {PROJECTS} must be a top-level YAML sequence, got {type(projects).__name__}. "
                 "A _data/projects/ DIRECTORY would produce a hash and break the dashboard at runtime.")
    if not isinstance(categories, list):
        sys.exit(f"FATAL: {CATEGORIES} must be a top-level YAML sequence.")

    cat_ids = {c["id"] for c in categories}
    seen_ids = set()
    seen_orders = {}

    for p in projects:
        pid = p.get("id", "<missing id>")

        for field in REQUIRED:
            if field not in p or p[field] is None:
                err(f"{pid}: missing required field `{field}`")

        if pid in seen_ids:
            err(f"{pid}: duplicate id")
        seen_ids.add(pid)

        if p.get("category") not in cat_ids:
            err(f"{pid}: category `{p.get('category')}` not in _data/project_categories.yml "
                f"({', '.join(sorted(cat_ids))})")

        if p.get("kind") not in KINDS:
            err(f"{pid}: kind `{p.get('kind')}` not one of {sorted(KINDS)}")

        if str(p.get("status")) not in STATUSES:
            err(f"{pid}: status `{p.get('status')}` not one of {sorted(STATUSES)}")

        # featured => featured_order, because Liquid's `sort` needs the key on every item.
        if p.get("featured"):
            if "featured_order" not in p:
                err(f"{pid}: featured: true requires featured_order")
            else:
                o = p["featured_order"]
                if o in seen_orders:
                    err(f"{pid}: featured_order {o} already used by {seen_orders[o]}")
                seen_orders[o] = pid
        elif "featured_order" in p:
            warnings.append(f"{pid}: featured_order set but featured is false — it will be ignored")

        # renderStats does PROJECTS.flatMap(p => p.tech), which throws on undefined.
        if not p.get("tech"):
            err(f"{pid}: tech must be a non-empty list")
        if not p.get("features"):
            err(f"{pid}: features must be a non-empty list")

        # Case studies have no code graph — renderD3Graph would have nothing to draw.
        if p.get("kind") == "case-study" and p.get("graph"):
            err(f"{pid}: kind: case-study must not define `graph`")

        # Presence-driven tabs: an explicit null reads as present-but-empty.
        for field in ("graph", "mermaid", "metrics", "experiment", "delivery", "lectures", "links"):
            if field in p and p[field] is None:
                err(f"{pid}: `{field}` is null — omit the key entirely instead")

        # An entry with no links needs an access chip, or the card footer is bare.
        if not p.get("links") and not p.get("access"):
            warnings.append(f"{pid}: no links and no `access` string — the card will show no provenance")

        for l in p.get("links") or []:
            if not l.get("label") or not l.get("url"):
                err(f"{pid}: every link needs both label and url")

        for m in p.get("metrics") or []:
            if not m.get("label") or not m.get("value"):
                err(f"{pid}: every metric needs both label and value")

        if p.get("diagram_label") and not p.get("mermaid"):
            err(f"{pid}: diagram_label set but there is no `mermaid` diagram to label")

        exp = p.get("experiment")
        if exp:
            for field in ("hypothesis", "design", "guardrails", "readouts"):
                if not exp.get(field):
                    err(f"{pid}: experiment.{field} is required when `experiment` is present")

        dlv = p.get("delivery")
        if dlv:
            for field in ("audience", "format", "outcomes"):
                if not dlv.get(field):
                    err(f"{pid}: delivery.{field} is required when `delivery` is present")

        for lec in p.get("lectures") or []:
            if lec.get("topic") not in TOPICS:
                err(f"{pid}: lecture topic `{lec.get('topic')}` not in TOPIC_COLORS {sorted(TOPICS)}")
            for field in ("date", "title", "duration"):
                if not lec.get(field):
                    err(f"{pid}: lecture missing `{field}`")

        # jsonify does not escape `<`, so this would close the JSON script tag early.
        for path, s in walk_strings(p, pid):
            if "</script" in s.lower():
                err(f"{pid}: `</script` found at {path} — it would terminate the JSON data tag")

    for c in categories:
        if not c.get("label"):
            err(f"category {c.get('id')}: missing label")

    unused = cat_ids - {p.get("category") for p in projects}
    for u in sorted(unused):
        warnings.append(f"category `{u}` has no projects — it will render an empty filter")

    for w in warnings:
        print(f"warn: {w}")
    for e in errors:
        print(f"ERROR: {e}")

    print(f"\n{len(projects)} projects, {len(categories)} categories, "
          f"{len(errors)} errors, {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
