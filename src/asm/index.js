import {parser} from "./parser";
import genSymbolTable from "./genSymbolTable";
import nodeToBin from "./nodeToBin";
import fs from "fs";

// const txt = String(fs.readFileSync("./src/asm/test"));
const txt = `
@0
D=M
@INFINITE_LOOP
D;JLE 
@counter
M=D
@SCREEN
D=A
@address
M=D
(LOOP)
@address
A=M
M=-1
@address
D=M
@32
D=D+A
@address
M=D
@counter
MD=M-1
@LOOP
D;JGT
(INFINITE_LOOP)
@INFINITE_LOOP
0;JMP
`;
const nodes = parser.parse(txt);
const table = genSymbolTable(nodes);
const convert = nodeToBin(table);
const prog = nodes.map(convert).filter(Boolean).join("\n");

console.log(prog);