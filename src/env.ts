import fs from "fs";
import path from "path";

export function parseEnvFile(cwd: string): Record<string, string> {
  const candidates = [".env.local", ".env.development.local", ".env"];
  const result: Record<string, string> = {};

  for (const filename of candidates) {
    const envPath = path.join(cwd, filename);
    if (!fs.existsSync(envPath)) continue;

    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;

      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      if (!(key in result)) {
        result[key] = value;
      }
    }
  }

  return result;
}
