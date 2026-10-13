# simulation-cli

Command-line tool for simulations, invoked as `sim`.

## Getting started

```bash
npm install
npm run dev -- --help     # run from source
npm run check             # typecheck + tests
npm run build && node dist/cli.js --help
```

Requires Node 22 or newer.

## Working on features in parallel

Each feature gets its own git worktree:

```bash
claude -w <feature-name>            # Claude Code: new worktree + session
npm run wt -- new <feature-name>    # without Claude Code
```

See [CLAUDE.md](CLAUDE.md) for the project layout, how to add a command, and the worktree workflow.
