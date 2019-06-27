const abtob = binArr => {
    const view = new Uint8Array(binArr);
    return view.reduce((a, n) => a + String.fromCharCode(n), "");
};

const btoab = bin => {
    const arrBuf = new ArrayBuffer(bin.length);
    const view = new Uint16Array(arrBuf);
    bin.split("").forEach((n, i) => {
        let idx = Math.floor(i/2);
        if (i%2) {
            view[idx] |= n.charCodeAt(0)
        } else {
            view[idx] = n.charCodeAt(0) << 8;
        }
    });
    return arrBuf;
};

const abtoa = binArr => {
    return btoa(abtob(binArr));
};

const atoab = b64 => {
    return btoab(atob(b64));
};

const copyAB = (src, dest) => {
    const a = new Uint8Array(src.buffer || src, src.byteOffset, src.byteLength);
    const b = new Uint8Array(
        dest.buffer || dest,
        dest.byteOffset,
        dest.byteLength
    );
    for (var i = 0; i < a.length && i < b.length; i++) {
        b[i] = a[i];
    }
};

const hacktob = str => {
    const raw = str.split("\n");
    const x = raw.reduce(
        (a, n) =>
            a +
            String.fromCharCode(parseInt(n.slice(0, 8), 2)) +
            String.fromCharCode(parseInt(n.slice(8), 2)),
        ""
    );
    return x;
};

const btohack = str => {
    const arr = str.split("").reduce((a, c, i) => {
        const value = `${"0".repeat(8)}${c.charCodeAt(0).toString(2)}`.slice(
            -8
        );
        if (!(i % 2)) {
            a.push(value);
        } else {
            a[a.length - 1] = a[a.length - 1] + value;
        }
        return a;
    }, []);
    if (arr[arr.length - 1].length === 8) {
        throw new Error("Invalid input:", str);
    }

    const zero = "0".repeat(16);
    while (arr.length && arr[arr.length - 1] === zero) arr.pop();

    return arr.join("\n");
};

const hacktoa = str => btoa(hacktob(str));

const hacktoab = str => btoab(hacktob(str));

const atohack = str => btohack(atob(str));

const abtohack = str => atohack(abtoa(str));

export { abtoa, atoab, copyAB, hacktoa, hacktob, hacktoab, btohack, atohack, abtohack };
