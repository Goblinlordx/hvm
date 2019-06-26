import {parser} from "./parser";
import genSymbolTable from "./genSymbolTable";
import nodeToBin from "./nodeToBin";

const Assembler = str => {
    const nodes = parser.parse(str);
    const table = genSymbolTable(nodes);
    const convert = nodeToBin(table);
    const prog = nodes.map(convert).filter(Boolean);
    return prog.join("\n");
};

export default Assembler;