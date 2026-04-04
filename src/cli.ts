import { program } from "commander";

program
  .name("bugside")
  .description("Next.js · Supabase · Vercel errors in one terminal pane")
  .version("0.1.0");

program
  .command("dev [port]")
  .description(
    "Start monitoring (browser proxy :port+1, Supabase proxy)\n" +
    "  Usage: npx bugside dev [port]        — browser errors only\n" +
    "         npm run dev | npx bugside dev  — terminal + browser errors"
  )
  .action(async (portArg?: string) => {
    const port = portArg ? parseInt(portArg, 10) : 3000;
    const { runDev } = await import("./commands/dev.js");
    await runDev({ port });
  });

program
  .command("init")
  .description('Add "dev:debug" script to package.json in current directory')
  .action(async () => {
    const { runInit } = await import("./commands/init.js");
    runInit();
  });

// 인자 없이 실행하면 dev로 기본 동작
if (process.argv.length === 2) {
  process.argv.push("dev");
}

program.parse();
