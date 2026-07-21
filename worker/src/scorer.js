// Deterministic keyword-coverage scorer. Pure function, no I/O, no LLM.
// The fit score comes from HERE, not the model — so it can never be hallucinated.

/**
 * Normalize text for matching: lowercase; every non-alphanumeric char except
 * `+`/`#` becomes a space (so `.` and `/` are separators — "next.js" -> "next js",
 * "FastAPI." -> "fastapi"); `+`/`#` kept for "c++"/"c#". Collapse + space-pad so
 * `includes()` matches whole tokens/phrases. Synonyms are normalized the SAME way,
 * so both sides agree on where word boundaries fall.
 */
function normalize(s) {
  return (
    " " +
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9+# ]/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

/**
 * Score how much of the JD's vocabulary Lance's verified experience covers.
 * @param {string} jd    Raw job-description text.
 * @param {object} bank  The experience bank (roles/projects/skills/synonyms).
 * @returns {{score:number, hits:string[], misses:string[], mentioned:number}}
 *   hits   = themes the JD mentions AND the bank has (real strengths to surface)
 *   misses = themes the JD mentions but the bank lacks (honest gap candidates)
 *   score  = hits / (hits + misses)  — coverage of what the JD actually asked for
 */
export function scoreCoverage(jd, bank) {
  const text = normalize(jd);

  // Themes Lance actually has, drawn from verified bullets + skills.
  const owned = new Set();
  for (const group of [bank.roles || [], bank.projects || []]) {
    for (const role of group) {
      for (const bullet of role.bullets || []) {
        for (const t of bullet.themes || []) owned.add(t);
      }
    }
  }
  for (const skill of bank.skills || []) {
    for (const t of skill.themes || []) owned.add(t);
  }

  const hits = [];
  const misses = [];
  for (const [theme, synonyms] of Object.entries(bank.synonyms || {})) {
    const mentioned = synonyms.some((syn) => text.includes(normalize(syn)));
    if (!mentioned) continue;
    (owned.has(theme) ? hits : misses).push(theme);
  }

  const mentioned = hits.length + misses.length;
  const score = mentioned ? hits.length / mentioned : 0;
  return { score, hits, misses, mentioned };
}
