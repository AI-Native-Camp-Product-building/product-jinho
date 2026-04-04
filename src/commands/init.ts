import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export function runInit() {
  const cwd = process.cwd();
  const pkgPath = join(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    console.error("No package.json found in current directory.");
    process.exit(1);
  }

  const raw = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);

  if (!pkg.scripts) pkg.scripts = {};

  if (pkg.scripts["dev:debug"]) {
    console.log(`Already set: "dev:debug" → ${pkg.scripts["dev:debug"]}`);
    return;
  }

  pkg.scripts["dev:debug"] = "npm run dev 2>&1 | npx bugside dev";

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");

  console.log(`\n  Added to package.json:\n`);
  console.log(`    "dev:debug": "npm run dev 2>&1 | npx bugside dev"\n`);
  console.log(`  Run with:\n`);
  console.log(`    npm run dev:debug\n`);
}
