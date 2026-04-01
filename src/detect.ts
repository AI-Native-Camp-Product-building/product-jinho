import fs from "fs";
import path from "path";
import { ProjectConfig } from "./types.js";
import { parseEnvFile } from "./env.js";

export function detectProject(cwd: string): ProjectConfig {
  const pkgPath = path.join(cwd, "package.json");

  if (!fs.existsSync(pkgPath)) {
    throw new Error(`package.json not found in ${cwd}`);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const hasNextjs = "next" in allDeps;
  const hasSupabase =
    "@supabase/supabase-js" in allDeps ||
    "@supabase/ssr" in allDeps ||
    "@supabase/auth-helpers-nextjs" in allDeps;
  const hasVercel = "vercel" in allDeps || fs.existsSync(path.join(cwd, ".vercel"));

  const envVars = parseEnvFile(cwd);

  return {
    hasNextjs,
    hasSupabase,
    hasVercel,
    supabaseUrl: envVars.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    projectRoot: cwd,
  };
}
