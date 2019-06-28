const wsRE = /[\t ]/;
const parse = str => {
    const tokens
    for (let i = 0; i < str.length; i++) {
        let current = str[i];
        if (wsRE.test(current)) {
            while (wsRE) {
                i++;
            }
            continue;
        }
        if (current === "\n") {
            const last = tokens[tokens.length - 1];
            if (last && last.type !== "NL") tokens.push({type: 'NL'});
            i++;
            continue
        }
        if (current === "/" && str[i+1] === "/") {
            i += 2;
            while (str[i] && str[i] !== "\n") {
                i++;
            }
            const last = tokens[tokens.length - 1];
            if (last && last.type !== "NL") tokens.push({type: 'NL'});
            i++;
            continue;
        }
        if (current === "/" && str[i+1] === "*") {
            i += 2;
            while (str[i] && str[i] !== "*" && str[i+1] !== "\\") {
                i++;
            }
            i += 2;
            continue;
        }
        if (current === "(") {
            i++;
            tokens.push({type: "PAREN_L"})
        }
        if (/[0-9]/.)
            if (!/[a-zA-Z_]/.test(str[i])) {
                throw new Error(`Invalid token`);
            }
            let j = i + 1;
            while (/[a-zA-Z0-9_\.$]/.str[j]) {
                j++;
            }
            if (str[j] !== ")") {
                throw new Error("Invalid token");
            }
            tokens.push({
                type: "LABEL",
                symbol: str.slice(i, j)
            });
            i = j + 1;
            continue;
        }
    }
    return tokens;
}

export {parse};