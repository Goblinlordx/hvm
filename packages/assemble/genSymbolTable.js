const defaultSymbols = () => Array(16).fill(null).map((_, i) => i).reduce((a, n) => {
    a[`R${n}`] = {value: n, loc: []};
    return a;
}, {
    SCREEN: {value: 16384, loc: []},
    KBD: {value: 24576, loc: []},
    SP: {value: 0, loc: []},
    LCL: {value: 1, loc: []},
    ARG: {value: 2, loc: []},
    THIS: {value: 3, loc: []},
    THAT: {value: 4, loc: []},
});

module.exports = nodes => {
    let idx = 0;
    const tbl = nodes.reduce((a, {type, symbol, loc}, i) => {
        if (type === "LABEL") {
            if (a[symbol] && a[symbol].labeled) throw new Error(`Duplicate symbol: ${symbol} [${loc[0]}:${loc[1]}]`);
            if (a[symbol]) {
                a[symbol].value = i-idx;
                a[symbol].loc.push(loc);
            } else {
                a[symbol] = {
                    value: i-idx,
                    loc: [loc],
                };
            }
            a[symbol].labeled = true;
            idx = idx + 1;
        } else if (["C_INS", "A_INS"].some(t => t === type) && symbol) {
            if (a[symbol]) {
                a[symbol].loc.push(loc);
            } else {
                a[symbol] = {
                    loc: [loc]
                };
            }
        }
        return a;
    }, defaultSymbols())

    // Assign address to variables
    let vIdx = 16;
    Object.keys(tbl).forEach(k => {
        if (tbl[k].value !== undefined) return;
        tbl[k].value = vIdx;
        vIdx++;
    });
    return tbl;
};