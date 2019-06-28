import minimist from "minimist";
import fs from "fs";
import assemble from "../assemble";
import convert from "../convert";

const args = minimist(process.argv.slice(2), {
  alias: {
    f: "format"
  },
  default: {
    format: "hack"
  }
});

const str = String(fs.readFileSync(args._[0]));
const out = convert("ab", args.format)(assemble(str));

if (typeof out === "string" || out instanceof Buffer) {
  process.stdout.write(out);
  process.stdout.write("\n");
} else {
  console.log(out);
}

