#!/usr/bin/env node
/**
 * Post-build checks for the Liquid-processed projects dashboard.
 *
 *   node script/verify-build.mjs         (after a jekyll build)
 *
 * The critical invariant: projects.html is now a Liquid page, but mermaid's
 * hexagon-node syntax uses double braces, which is also Liquid's output-tag
 * syntax. Data lives in _data/projects.yml (never Liquid-parsed) and reaches
 * the page through a JSON script tag. These checks prove that held.
 */
import fs from "fs";

const SITE = "_site";
let failures = 0;

const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const html = fs.readFileSync(`${SITE}/projects.html`, "utf8");

const grab = (id) => {
  const m = html.match(new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  return m ? m[1] : null;
};

const projectsRaw = grab("projects-data");
const categoriesRaw = grab("categories-data");

check("projects-data tag present", projectsRaw !== null);
check("categories-data tag present", categoriesRaw !== null);
if (projectsRaw === null || categoriesRaw === null) process.exit(1);

let projects, categories;
try {
  projects = JSON.parse(projectsRaw);
  categories = JSON.parse(categoriesRaw);
  check("data tags contain valid JSON", true, `${projects.length} projects, ${categories.length} categories`);
} catch (e) {
  check("data tags contain valid JSON", false, e.message);
  process.exit(1);
}

check("projects parsed as an array", Array.isArray(projects),
  Array.isArray(projects) ? "" : "a _data/projects/ DIRECTORY would produce an object and break the dashboard");

// Liquid must not have consumed mermaid's double-brace nodes.
const withMermaid = projects.filter((p) => p.mermaid);
const hexNodes = withMermaid.filter((p) => /\{\{[^}]+\}\}/.test(p.mermaid));
check("mermaid double-brace nodes survived Liquid", hexNodes.length > 0,
  `${hexNodes.length} of ${withMermaid.length} diagrams use them`);

// Every double brace in the page must be inside the data tag; none loose in markup.
const outside = html.replace(projectsRaw, "");
check("no double-brace tokens loose in the page", !/\{\{/.test(outside));
check("no unrendered Liquid tag markers", !/\{%/.test(html));

// jsonify does not escape `<`; a `</script` in data would truncate the tag.
const bad = [];
const walk = (node, path) => {
  if (typeof node === "string") {
    if (node.toLowerCase().includes("</script")) bad.push(path);
  } else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (node && typeof node === "object") for (const k in node) walk(node[k], `${path}.${k}`);
};
projects.forEach((p) => walk(p, p.id));
check("no `</script` in any data value", bad.length === 0, bad.join(", "));

// Renderer preconditions — these throw at runtime rather than at build time.
const noTech = projects.filter((p) => !Array.isArray(p.tech) || !p.tech.length).map((p) => p.id);
check("every project has a non-empty tech list", noTech.length === 0, noTech.join(", "));

const caseWithGraph = projects.filter((p) => p.kind === "case-study" && p.graph).map((p) => p.id);
check("no case study defines a code graph", caseWithGraph.length === 0, caseWithGraph.join(", "));

const catIds = new Set(categories.map((c) => c.id));
const orphan = projects.filter((p) => !catIds.has(p.category)).map((p) => p.id);
check("every project category exists", orphan.length === 0, orphan.join(", "));

const featured = projects.filter((p) => p.featured);
check("every featured project has featured_order",
  featured.every((p) => typeof p.featured_order === "number"),
  featured.map((p) => `${p.id}:${p.featured_order}`).join(" "));

// The homepage renders from the same data.
if (fs.existsSync(`${SITE}/index.html`)) {
  const index = fs.readFileSync(`${SITE}/index.html`, "utf8");
  check("homepage has no unrendered Liquid", !/\{\{|\{%/.test(index));
  const missing = featured.filter((p) => !index.includes(p.name)).map((p) => p.id);
  check("homepage renders every featured project", missing.length === 0, missing.join(", "));
  check("homepage no longer links the retired inventory", !index.includes("github-projects.html"));
}

console.log(`\n${failures === 0 ? "PASS" : `FAIL — ${failures} check(s)`}`);
process.exit(failures === 0 ? 1 && 0 : 1);
