const wsRE = /\s/;
const numStartRE = /(-|[0-9])/;
const numRE = /[0-9]/;
const alphaRE = /[a-zA-Z]/;
const wordRE = /[\w.\-\+=;]/;

export default [
    {
        test: c => c === "\n",
        resolve: ctx => ({
            type: "new_line",
            value: "\n",
            line: ctx.line,
            col: ctx.col,
            idx: ctx.idx
        }),
        nextIdx: ctx => {
            ctx.idx++;
            ctx.col = 1;
            ctx.line++;
        }
    },
    {
        test: c => wsRE.test(c),
        skip: true
    },
    {
        test: c => c === "/",
        resolve: (ctx, input) => {
            const startIdx = ctx.idx;
            let current = ctx.idx + 1;
            if (input[current] !== "/") {
                if (current > input.length)
                    throw new Error(UnexpectedEndOfContent);
                throw new Error(InvalidTokenError({ ctx, current }, input));
            }
            while (input[current] !== "\n" && current < input.length) current++;
            ctx.idx = current;
            ctx.col = ctx.col + current - startIdx;
            if (input[current] === "\n") {
                const token = {
                    type: "new_line",
                    value: "\n",
                    line: ctx.line,
                    col: ctx.col,
                    idx: ctx.idx
                };
                ctx.line++
                ctx.col = 0;
                return token;
            }
            return true;
        }
    },
    {
        test: c => c === "@",
        resolve: (ctx, input) => ({
            type: "at_symbol",
            value: input[ctx.idx],
            line: ctx.line,
            col: ctx.col,
            idx: ctx.idx
        })
    },
    {
        test: c => c === "(",
        resolve: (ctx, input) => ({
            type: "paren_open",
            value: input[ctx.idx],
            line: ctx.line,
            col: ctx.col,
            idx: ctx.idx,
        })
    },
    {
        test: c => c === ")",
        resolve: (ctx, input) => ({
            type: "paren_close",
            value: input[ctx.idx],
            line: ctx.line,
            col: ctx.col,
            idx: ctx.idx,
        })
    },
    {
        test: c => c === "-",
        resolve: (ctx, input) => ({
            type: "neg",
            value: input[ctx.idx],
            line: ctx.line,
            col: ctx.col,
            idx: ctx.idx,
        })
    },
    {
        test: c => numRE.test(c),
        resolve: (ctx, input) => {
            const startIdx = ctx.idx;
            let current = ctx.idx + 1;
            while (numRE.test(input[current]) && current < input.length) current++;
            return {
                type: "number",
                value: parseInt(input.substring(startIdx, current)),
                line: ctx.line,
                col: ctx.col,
                idx: ctx.idx
            };
        }
    },
    {
        test: c => alphaRE.test(c),
        resolve: (ctx, input) => {
            const startIdx = ctx.idx;
            let current = ctx.idx + 1;
            while (wordRE.test(input[current]) && current < input.length) current++;
            return {
                type: "text",
                value: input.substring(startIdx, current),
                line: ctx.line,
                col: ctx.col,
                idx: ctx.idx
            };
        }
    }
];
