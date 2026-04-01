import { program } from "commander";

program
  .name("bugside")
  .description("Next.js · Supabase · Vercel errors in one terminal pane")
  .version("0.1.0");

program
  .command("dev")
  .description("Start monitoring — runs next dev and watches all error sources")
  .option("-p, --port <number>", "Next.js dev server port", "3000")
  .action(async (opts) => {
    const { runDev } = await import("./commands/dev.js");
    await runDev({ port: parseInt(opts.port, 10) });
  });

// 인자 없이 실행하면 dev로 기본 동작
if (process.argv.length === 2) {
  process.argv.push("dev");
}

program.parse();
