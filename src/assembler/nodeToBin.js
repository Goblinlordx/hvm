const toBin = n => {
    const upper = (n & 0xFF00) >>> 8;
    const lower = (n & 0xFF) >>> 0;
    return String.fromCharCode(upper) + String.fromCharCode(lower);
}
const aPrefix = n => n & 0xFFFF >>> 1;
const cPrefix = n => n | 7 << (16 - 3);

const JMP_CODES = {
    JGT: 1,
    JEQ: 2,
    JGE: 3,
    JLT: 4,
    JNE: 5,
    JLE: 6,
    JMP: 7
};

const STORE_CODES = {
    M: 1,
    D: 2,
    MD: 3,
    A: 4,
    AM: 5,
    AD: 6,
    AMD: 7
};

const COMPUTE_CODES = {
    0: parseInt("0101010", 2),
    1: parseInt("0111111", 2),
    "-1": parseInt("0111010", 2),
    D: parseInt("0001100", 2),
    A: parseInt("0110000", 2),
    M: parseInt("1110000", 2),
    "!D": parseInt("0001101", 2),
    "!A": parseInt("0110001", 2),
    "!M": parseInt("1110001", 2),
    "-D": parseInt("0001111", 2),
    "-A": parseInt("0110011", 2),
    "-M": parseInt("1110011", 2),
    "D+1": parseInt("0011111", 2),
    "A+1": parseInt("0110111", 2),
    "M+1": parseInt("1110111", 2),
    "D-1": parseInt("0001110", 2),
    "A-1": parseInt("0110010", 2),
    "M-1": parseInt("1110010", 2),
    "D+A": parseInt("0000010", 2),
    "D+M": parseInt("1000010", 2),
    "D-A": parseInt("0010011", 2),
    "D-M": parseInt("1010011", 2),
    "A-D": parseInt("0000111", 2),
    "M-D": parseInt("1000111", 2),
    "D&A": parseInt("0000000", 2),
    "D&M": parseInt("1000000", 2),
    "D|A": parseInt("0010101", 2),
    "D|M": parseInt("1010101", 2),
};

export default table => node => {
    if (node.type === 'LABEL') return;
    if (node.type === 'A_INS') {
        let value = node.value ;
        if (value === null) {
            value = table[node.symbol].value;
        }
        return toBin(aPrefix(value));
    }
    if (node.type === 'C_INS') {
        let store;
        let jump;
        if (node.store) {
            store = STORE_CODES[node.store];
            if (!store) throw new Error(`Invalid store instruction: ${node.store} [${node.loc[0]}:${node.loc[1]}]`);
        }
        if (node.jump) {
            jump = JMP_CODES[node.jump];
            if (!jump) throw new Error(`Invalid jump instruction: ${node.jump} [${node.loc[0]}:${node.loc[1]}]`);
        }
        const compute = COMPUTE_CODES[node.compute];
        if (!compute) throw new Error(`Invalid compute instruction: ${node.compute} [${node.loc[0]}:${node.loc[1]}]`);
        return toBin(cPrefix((compute << 6) | (store << 3)) | jump);
    }
    throw new Error(`Unknown node type: ${node.type}`);
}