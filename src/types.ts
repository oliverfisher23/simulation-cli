/** A CLI subcommand. Each file in src/commands/ default-exports one of these. */
export interface Command {
  /** Name typed on the command line, e.g. `sim <name>`. */
  name: string;
  /** One-line description shown in `sim --help`. */
  summary: string;
  /** Runs the command with the arguments after its name. Returns the exit code. */
  run(args: string[]): number | Promise<number>;
}
