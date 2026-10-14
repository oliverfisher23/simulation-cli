import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { loadCommands } from "../src/registry.js";

const runCli = (...args: string[]) =>
  spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts", ...args], { encoding: "utf8" });

test("every command module loads and has a unique name", async () => {
  const commands = await loadCommands();
  assert.ok(commands.size > 0);
  for (const [name, command] of commands) {
    assert.equal(command.name, name);
    assert.ok(command.summary, `${name} needs a summary`);
  }
});

test("help lists the commands", () => {
  const result = runCli("--help");
  assert.equal(result.status, 0);
  assert.match(result.stdout, /version\s+Print the CLI version/);
});

test("unknown command exits 1", () => {
  const result = runCli("nope");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command: nope/);
});

test("version prints package version", () => {
  const out = execFileSync(process.execPath, ["--import", "tsx", "src/cli.ts", "version"], {
    encoding: "utf8",
  });
  assert.match(out.trim(), /^\d+\.\d+\.\d+/);
});
