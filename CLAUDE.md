# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## Project

`simulation-cli` is a Node/TypeScript command-line tool, invoked as `sim`.

- Node >= 22, ESM (`"type": "module"`), TypeScript strict mode.
- Dev dependencies only: `typescript`, `tsx`, `@types/node`. Ask before adding runtime dependencies.
- Tests use the built-in `node:test` runner via `tsx`.

## Commands

```bash
npm install            # first thing in a fresh clone or worktree
npm run dev -- <cmd>   # run the CLI from source, e.g. npm run dev -- --help
npm test               # run tests
npm run typecheck      # tsc --noEmit
npm run check          # typecheck + tests — run before every commit
npm run build          # compile to dist/ (bin: dist/cli.js)
```

## Layout

```
src/cli.ts          entry point: parses argv, dispatches to a command
src/registry.ts     auto-discovers commands from src/commands/
src/types.ts        the Command interface
src/commands/*.ts   one file per subcommand, each default-exports a Command
test/*.test.ts      tests (node:test)
scripts/worktree.sh worktree helper (npm run wt)
```

### Adding a command

Create `src/commands/<name>.ts` that default-exports a `Command` (`name`, `summary`, `run(args)` returning an exit code), and add `test/<name>.test.ts`. Do **not** edit `cli.ts` or a central list: commands are discovered from the directory, so parallel features don't conflict.

## Parallel features with worktrees

Several features are developed at once, each in its own git worktree with its own Claude session.

**Start a feature**

```bash
claude --worktree <feature-name>     # or: claude -w <feature-name>
```

This creates `.claude/worktrees/<feature-name>/` on branch `worktree-<feature-name>`, branched from the remote default branch, and copies files listed in `.worktreeinclude` (e.g. `.env`). Then run `npm install` inside it.

Without Claude Code: `npm run wt -- new <feature-name>` creates the same layout on branch `feature/<feature-name>` and runs `npm ci`. `npm run wt -- list` / `npm run wt -- rm <feature-name>` list and remove worktrees.

**Rules for working in a worktree**

- Stay inside your own worktree directory. Never read, edit or run git commands against another worktree or the main checkout.
- One feature per worktree and branch. If you find unrelated work, note it rather than doing it.
- Keep a feature's code in its own files (`src/commands/<feature>.ts`, `src/<feature>/`, `test/<feature>.test.ts`). Touch shared files (`src/types.ts`, `src/registry.ts`, `src/cli.ts`, `package.json`) only when the feature truly needs it, and keep those edits small.
- Each worktree has its own `node_modules`; run `npm install` after creating one or after `package.json` changes.
- Before opening a PR: merge the latest `main` into your branch, run `npm run check`, and resolve conflicts in your branch, not on `main`.
- Commit often with clear messages; push your branch and open a PR into `main`.

## Conventions

- Small, focused modules; named exports except each command's default export.
- Use `node:` builtins (`node:fs/promises`, `node:util` `parseArgs`) before reaching for a library.
- Commands return an exit code instead of calling `process.exit`; print user output to stdout and errors to stderr.
- Import local files with the `.js` extension (NodeNext resolution), e.g. `import { x } from "./x.js"`.
