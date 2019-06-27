import assemble from '.';
import { btohack } from "../utils";
import fs from "fs";

const filename = process.argv[2];
const str = String(fs.readFileSync(filename));
console.log(btohack(assemble(str)));