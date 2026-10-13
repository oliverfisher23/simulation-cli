import { readdir } from "node:fs/promises";
import type { Command } from "./types.js";

const commandsDir = new URL("./commands/", import.meta.url);

/**
 * Loads every command module in src/commands/.
 *
 * Commands are discovered from the directory rather than listed by hand so
 * that features built in parallel worktrees never edit the same file.
 */
export async function loadCommands(): Promise<Map<string, Command>> {
  const files = (await readdir(commandsDir))
    .filter((f) => /\.(ts|js)$/.test(f) && !f.endsWith(".d.ts"))
    .sort();

  const commands = new Map<string, Command>();
  for (const file of files) {
    const mod = (await import(new URL(file, commandsDir).href)) as { default?: Command };
    const command = mod.default;
    if (!command?.name || typeof command.run !== "function") {
      throw new Error(`src/commands/${file} must default-export a Command`);
    }
    if (commands.has(command.name)) {
      throw new Error(`Duplicate command name "${command.name}" in src/commands/${file}`);
    }
    commands.set(command.name, command);
  }
  return commands;
}
