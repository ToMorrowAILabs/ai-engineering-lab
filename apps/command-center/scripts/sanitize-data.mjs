#!/usr/bin/env node
/**
 * Sanitize course repo data into apps/command-center/data/
 * Strips machine paths — safe for Vercel deploy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../projects/local-chatbot");
const OUT_DIR = path.resolve(__dirname, "../data");

function stripPaths(obj) {
  if (Array.isArray(obj)) return obj.map(stripPaths);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (["local_path", "library_root", "repo_root", "pdf_path"].includes(k)) continue;
      if (typeof v === "string" && (v.startsWith("/Volumes/") || v.startsWith("/Users/"))) continue;
      out[k] = stripPaths(v);
    }
    return out;
  }
  return obj;
}

function main() {
  const manifestPath = path.join(REPO_ROOT, "courses/math/resources/ingestion_manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.warn("Course manifest not found — skipping resource sync");
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const resources = stripPaths(manifest.resources).map((r) => ({
    ...r,
    pdfAvailable: Boolean(manifest.resources.find((x) => x.id === r.id)?.local_path),
  }));

  const existing = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "resources.json"), "utf-8"));
  existing.resources = resources;
  existing.librarySummary = {
    pdfCount: resources.filter((r) => r.pdfAvailable).length,
    syncValid: true,
    lastSync: manifest.updated_at ?? new Date().toISOString(),
    storageLabel: "external-library",
    calibreStaged: resources.filter((r) => r.pdfAvailable).length,
  };
  fs.writeFileSync(path.join(OUT_DIR, "resources.json"), JSON.stringify(existing, null, 2));
  console.log("Updated data/resources.json with sanitized manifest");
}

main();
