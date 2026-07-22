import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const bank = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../data/experience-bank.json", import.meta.url)),
    "utf8",
  ),
);

test("bank has the expected top-level sections", () => {
  for (const k of ["profile", "roles", "projects", "skills", "synonyms"]) {
    assert.ok(bank[k], `missing section: ${k}`);
  }
});

test("every bullet id is unique", () => {
  const ids = [];
  for (const group of [bank.roles, bank.projects]) {
    for (const r of group) for (const b of r.bullets) ids.push(b.id);
  }
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes, [], `duplicate bullet ids: ${dupes.join(", ")}`);
  assert.ok(ids.length > 0, "bank has no bullets");
});

test("every bullet is verified, themed, and non-empty (source-of-truth integrity)", () => {
  for (const group of [bank.roles, bank.projects]) {
    for (const r of group) {
      for (const b of r.bullets) {
        assert.equal(b.verified, true, `bullet ${b.id} is not marked verified`);
        assert.ok(Array.isArray(b.themes) && b.themes.length, `bullet ${b.id} has no themes`);
        assert.ok(typeof b.text === "string" && b.text.trim().length, `bullet ${b.id} has no text`);
      }
    }
  }
});

test("synonyms map is non-empty and well-formed", () => {
  const entries = Object.entries(bank.synonyms);
  assert.ok(entries.length > 0, "synonyms map is empty");
  for (const [k, v] of entries) {
    assert.ok(Array.isArray(v) && v.length, `synonym "${k}" must be a non-empty array`);
  }
});

test("enterprise auth is NOT claimed as an owned theme (honesty guard)", () => {
  // auth/rbac must stay UNowned so OAuth/SAML/SSO/RBAC surface as honest gaps,
  // not false matches. Guards against re-tagging the Supabase RLS bullet.
  const owned = new Set();
  for (const group of [bank.roles, bank.projects]) {
    for (const r of group) for (const b of r.bullets) for (const t of b.themes) owned.add(t);
  }
  for (const s of bank.skills) for (const t of s.themes || []) owned.add(t);
  assert.ok(!owned.has("auth"), "'auth' must not be an owned theme (enterprise auth is not claimed)");
  assert.ok(!owned.has("rbac"), "'rbac' must not be an owned theme (RBAC is not claimed)");
});


test("no synonym phrase is claimed by two themes (double-count guard)", () => {
  // A phrase listed under two themes makes one JD mention score twice.
  const norm = (s) =>
    " " + s.toLowerCase().replace(/[^a-z0-9+# ]/g, " ").replace(/\s+/g, " ").trim() + " ";
  const seen = new Map();
  const dupes = [];
  for (const [theme, syns] of Object.entries(bank.synonyms)) {
    for (const syn of syns) {
      const k = norm(syn);
      const prev = seen.get(k);
      if (prev && prev !== theme) {
        dupes.push(`"${syn}" claimed by both "${prev}" and "${theme}"`);
      } else {
        seen.set(k, theme);
      }
    }
  }
  assert.deepEqual(dupes, [], dupes.join("\n"));
});
