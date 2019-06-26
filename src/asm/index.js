import {parser} from "./parser";
import genSymbolTable from "./genSymbolTable";
import fs from "fs";

const txt = String(fs.readFileSync("./src/asm/test"));
const tokens = parser.parse(txt);
const table = genSymbolTable(tokens);
console.log(tokens, table)