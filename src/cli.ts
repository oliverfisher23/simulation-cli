#!/usr/bin/env node
import { loadCommands } from "./registry.js";
import type { Command } from "./types.js";

function printHelp(commands: Map<string, Command>): void {
  const width = Math.max(0, ...[...commands.keys()].map((n) => n.length));
  console.log("Usage: sim <command> [options]\n\nCommands:");
  for (const c of commands.values()) {
    console.log(`  ${c.name.padEnd(width)}  ${c.summary}`);
  }
}

export async function main(argv: string[]): Promise<number> {
  const commands = await loadCommands();
  const [name, ...rest] = argv;

  if (!name || name === "-h" || name === "--help" || name === "help") {
    printHelp(commands);
    return 0;
  }

  const command = commands.get(name);
  if (!command) {
    console.error(`Unknown command: ${name}\n`);
    printHelp(commands);
    return 1;
  }
  return command.run(rest);
}

process.exitCode = await main(process.argv.slice(2));
