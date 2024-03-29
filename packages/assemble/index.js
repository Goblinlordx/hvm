const {parser} = require("./parser");
const genSymbolTable = require("./genSymbolTable");
const nodeToBin = require("./nodeToBin");

const assemble = str => {
    const nodes = parser.parse(str);
    const table = genSymbolTable(nodes);
    const convert = nodeToBin(table);
    const instr = nodes.map(convert).filter(Boolean);
    const ab = new ArrayBuffer(instr.length * 2);
    const v = new Uint8Array(ab);
    instr.forEach((bytes, i) => {
        const idx = i * 2;
        v[idx] = bytes[0];
        v[idx + 1] = bytes[1];
    });
    return v.buffer;
};

module.exports = assemble;