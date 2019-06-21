import asmJisonlex from './asm.jisonlex'
import {Parser} from "jison";
console.log(new Parser(asmJisonlex).generateModule().length)
import TOKENS from "./tokens";

const UnexpectedEndOfContent = `Unexpected end of content`;
const InvalidTokenError = (tokenCtx, input) => {
    const currentColIdx =
        tokenCtx.current - tokenCtx.ctx.idx + tokenCtx.ctx.col;
    return `Invalid token, line: ${tokenCtx.ctx.line} col: ${currentColIdx}
${input.split("\n")[tokenCtx.ctx.line - 1]}
${" ".repeat(currentColIdx - 1)}^
`;
};
const InvalidInstructionError = (currentToken, input, offset) => {
    const col = currentToken.col + offset;
    return `Invalid instruction, line: ${currentToken.line} col: ${col}
${input.split("\n")[currentToken.line - 1]}
${" ".repeat(col - 1)}^`;
};

const tokenize = (input, receiver) => {
    const ctx = {
        idx: 0,
        line: 1,
        col: 1
    };
    const output = receiver ? undefined : [];
    const emit = token => {
        if (receiver) return receiver(token);
        output.push(token);
    };
    if (!input) return [];
    if (typeof input !== "string") throw new Error("Invalid input");
    while (ctx.idx < input.length) {
        let token;
        let i;
        for (i = 0; i < TOKENS.length; i++) {
            if (!TOKENS[i].test(input[ctx.idx])) continue;
            token = TOKENS[i].skip || TOKENS[i].resolve(ctx, input);
            if (token) break;
        }
        if (!token)
            throw new Error(
                InvalidTokenError({ ctx, current: ctx.idx }, input)
            );
        if (token === true) {
            ctx.idx++;
            ctx.col++;
        } else if (TOKENS[i].nextIdx) {
            TOKENS[i].nextIdx(ctx);
            emit(token);
        } else {
            let add = token.value.toString().length;
            ctx.idx += add;
            ctx.col += add;
            emit(token);
        }
    }
    return output;
};

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

const parser = (tokens, input) => {
    const rootAstNode = {
        type: "root",
        children: []
    };
    let currentAstNode = rootAstNode;
    let currentToken = null;
    let currentInstruction = null;
    for (var i = 0; i < tokens.length; i++) {
        currentToken = tokens[i];
        const { type, value } = currentToken;
        if (type === "new_line") {
            continue;
        }
        if (type === "at_symbol") {
            i++;
            let nextToken = tokens[i];
            let node;
            if (nextToken.type === "number") {
                node = {
                    type: "a_instruction",
                    value: parseInt(nextToken),
                    idx: currentToken.idx,
                    line: currentToken.line,
                    col: currentToken.col,
                };
            } else if (nextToken.type === "neg") {
                i++
                nextToken = tokens[i];
                if (nextToken.type === "number") {
                    
                }
            }
        } else if (type === "paren_open") {
        } else if (type === "text") {
            let jmp;
            let compute;
            let dest;
            const [cint, jmpcode] = value.split(";");
            const [dst, cmp] = cint.split("=");
            if (/=/.test(value)) {
                const d = STORE_CODES[dst];
                if (!d)
                    throw new Error(
                        InvalidInstructionError(currentToken, input)
                    );
                compute = COMPUTE_CODES[cmp];
            } else {
                compute = COMPUTE_CODES[dst];
            }
            if (!compute) throw new Error(InvalidInstructionError(currentToken, input, 0));
            if (/;/.test(value)) {
                jmp = JMP_CODES[jmpcode];
                if (!jmp) {
                    const offset = value.indexOf(";") + 1;
                    throw new Error(
                        InvalidInstructionError(currentToken, input, offset)
                    );
                }
            }
        } else {
            throw new Error(
                InvalidTokenError({ ctx: currentToken, current: 0 })
            );
        }
    }
    return rootAstNode;
};

export { tokenize, parser };
