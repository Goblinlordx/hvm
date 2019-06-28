const g = typeof window === 'object' ? window : typeof global === 'object' ? global : undefined;
const btoa = g.btoa || g.Buffer && (str => g.Buffer.from(str, 'binary').toString('base64'));
const atob = g.atob || g.Buffer && (str => g.Buffer.from(str, 'base64').toString('binary'));

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

const abtohack = ab => btohack(abtob(ab));

const abtobuf = ab => {
    if (!g.Buffer) return ab;
    const bytes = new Uint8Array(ab);
    const buf = new Buffer.alloc(bytes.byteLength);
    for(let i = 0; i < bytes.length; i++) {
        buf[i] = bytes[i];
    }
    return buf;
}


const lkup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const rlkup = lkup.split("").reduce((a, c, i) => {
    a[c] = i;
    return a;
}, {});

const encode64 = (a = { accum: [] }, b) => {
  const { len = 0, last = 0x0 } = a;
  const first =
    (last << (6 - len * 2)) | ((b & 0xff) >>> (2 * (len + (1 % 3))));
  a.accum.push(lkup[first]);
  a.len = len + 1;
  if (a.len == 3) {
    a.accum.push(lkup[0x3f & b]);
    a.len = 0;
    a.last = 0;
  } else {
    a.last = b & (0xf >> (2 * (a.len % 2)));
  }
  return a;
};

const decode64 = str => {
    const v = [];
    let accum = null;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "=") {
            break;
        }
        const c = rlkup[str[i]];
        if (i%4 == 0) {
            accum = c << 2;
        } else if (i%4 === 1) {
            v.push(accum | (c >>> 4));
            accum = 0xFF & (c << 4);
        } else if (i%4 === 2) {
            v.push(accum | c >> 2);
            accum = 0xFF & (c << 6);
        } else if (i%4 === 3) {
            v.push(accum | c)
            accum = null;
        }
    }
    if (accum !== null) {
        v.push(accum);
    }
    return new Uint8Array(v).buffer;
}

const from = {
  utf8: str =>
    new Uint8Array(
      Array(str.length)
        .fill(0)
        .map((_, i) => str.charCodeAt(i))
    ).buffer,
  ab: ab => ab,
  hack: hack => {
    const bytes = hack
      .split("\n")
      .filter(Boolean)
      .map(n => [parseInt(n.slice(0, 8), 2), parseInt(n.slice(8), 2)])
      .reduce((a, [upper, lower]) => {
          a.push(upper);
          a.push(lower);
          return a;
      }, []);
      return new Uint8Array(bytes).buffer;
  },
  bin: buf => {
    const ab = new ArrayBuffer(buf.byteLength);
    const v = new Uint8Array(ab);
    for (let i; i < v.byteLength; i++) {
      v[i] = buf[i];
    }
    return ab;
  },
  b64: str => decode64(str)
};
const to = {
  utf8: ab => {
    const arr = Array(ab.byteLength).fill(null);
    const v = new Uint8Array(ab);
    return arr.map((_, i) => String.fromCharCode(v[i])).join("");
  },
  ab: ab => ab,
  hack: ab => {
    const v = new Uint8Array(ab);
    const arr = Array(v.length / 2).fill(null);
    return arr
      .map((_, i) => ("0".repeat(8) + v[i*2].toString(2)).slice(-8) + ('0'.repeat(8) + v[(i*2)+1].toString(2)).slice(-8))
      .join("\n");
  },
  bin: ab => {
    if (typeof Buffer === "undefined") return ab;
    const buf = new Buffer.alloc(ab.byteLength);
    const v = new Uint8Array(ab);
    for (let i = 0; i < ab.byteLength; i++) {
      buf[i] = v[i];
    }
    return buf;
  },
  b64: ab => {
    const v = new Uint8Array(ab);
    let a = { accum: [] };
    for (let i = 0; i < v.byteLength; i++) {
      encode64(a, v[i]);
    }
    if (a.len) {
      a.accum.push(lkup[a.last << (2 * (3 - a.len))]);
      for (let i = 3 - a.len; i > 0; i--) {
        a.accum.push("=");
      }
    }
    return a.accum.join("");
  }
};

const convert = (fk = 'ab', tk = 'ab') => v => to[tk](from[fk](v));

export { convert, btoa, atob, abtoa, atoab, copyAB, hacktoa, hacktob, hacktoab, btohack, atohack, abtohack, abtobuf };
