import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function loadJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function loadMarkdown(filename: string): string {
  const filePath = path.join(DATA_DIR, filename);
  return fs.readFileSync(filePath, "utf-8");
}
