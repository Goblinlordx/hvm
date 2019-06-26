
export default tokens => {
    let idx = 0;
    const tbl = tokens.reduce((a, {type, symbol, loc}, i) => {
        if (type === "LABEL") {
            if (a[symbol] && a[symbol].value) throw new Error(`Duplicate symbol: ${symbol} [${loc[0]}:${loc[1]}]`);
            if (a[symbol]) {
                a[symbol].value = i-idx+1;
                a[symbol].loc.push(loc);
            } else {
                a[symbol] = {
                    value: i-idx+1,
                    loc: [loc],
                };
            }
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
    }, {})
    const undef = Object.keys(tbl).filter(k => tbl[k].value === undefined);
    if (undef.length) {
        const {loc} = tbl[undef[0]];
        throw new Error(`Undefined symbol: ${undef[0]} [${loc[0][0]}:${loc[0][1]}]`)
    }
    return tbl;
};