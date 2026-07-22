import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { scoreCoverage } from "../src/scorer.js";

const bank = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../data/experience-bank.json", import.meta.url)),
    "utf8",
  ),
);

test("hits themes the JD mentions and the bank has", () => {
  const jd =
    "We need RAG, LangGraph agents, tool calling, guardrails, evaluation, Azure OpenAI and FastAPI.";
  const { hits } = scoreCoverage(jd, bank);
  for (const t of ["rag", "agents", "guardrails", "evaluation", "azure-openai", "fastapi"]) {
    assert.ok(hits.includes(t), `expected hit: ${t} (got ${hits.join(",")})`);
  }
});

test("misses themes the JD wants but the bank lacks", () => {
  const jd = "You must have SAML, SSO and OAuth enterprise authentication experience.";
  const { hits, misses } = scoreCoverage(jd, bank);
  assert.ok(misses.includes("auth"), `expected 'auth' in misses (got ${misses.join(",")})`);
  assert.ok(!hits.includes("auth"), "auth should not be a hit");
});

test("word-boundary matching does not match substrings", () => {
  // "sql" must not be found inside "postgresql"
  const { hits } = scoreCoverage("We use postgresql heavily.", bank);
  assert.ok(hits.includes("postgres"), "postgres should hit");
  assert.ok(!hits.includes("sql"), "'sql' must not match inside 'postgresql'");
});

test("hyphen/spacing variants normalize (forward-deployed)", () => {
  const { hits } = scoreCoverage("This is a forward-deployed onsite role.", bank);
  assert.ok(hits.includes("forward-deployed"), `expected forward-deployed (got ${hits.join(",")})`);
});

test("score is fraction of mentioned-known that is owned", () => {
  const jd = "RAG and SAML."; // rag => hit, saml => auth miss
  const { score, hits, misses } = scoreCoverage(jd, bank);
  assert.ok(hits.includes("rag"));
  assert.ok(misses.includes("auth"));
  assert.ok(score > 0 && score < 1, `score should be between 0 and 1 (got ${score})`);
});

test("empty / irrelevant JD yields zero mentioned", () => {
  const { mentioned, score } = scoreCoverage("the quick brown fox jumped over.", bank);
  assert.equal(mentioned, 0);
  assert.equal(score, 0);
});


test("JD technologies the bank lacks surface as misses", () => {
  const jd =
    "Our stack: Kubernetes, Databricks, Spark, Snowflake, dbt, Airflow, Kafka, Terraform, MLflow, Tableau, Power BI, Looker, Java, Scala, Golang.";
  const { hits, misses } = scoreCoverage(jd, bank);
  for (const t of [
    "kubernetes", "databricks", "spark", "snowflake", "dbt", "airflow", "kafka",
    "terraform", "mlflow", "tableau", "power-bi", "looker", "java", "scala", "golang",
  ]) {
    assert.ok(misses.includes(t), `expected miss: ${t} (got ${misses.join(",")})`);
    assert.ok(!hits.includes(t), `${t} must not be a hit`);
  }
});
