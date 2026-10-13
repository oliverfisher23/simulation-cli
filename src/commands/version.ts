import { createRequire } from "node:module";
import type { Command } from "../types.js";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json") as { version: string };

const version: Command = {
  name: "version",
  summary: "Print the CLI version",
  run() {
    console.log(pkg.version);
    return 0;
  },
};

export default version;
