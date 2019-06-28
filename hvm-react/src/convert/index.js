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
    if (i % 4 == 0) {
      accum = c << 2;
    } else if (i % 4 === 1) {
      v.push(accum | (c >>> 4));
      accum = 0xff & (c << 4);
    } else if (i % 4 === 2) {
      v.push(accum | (c >> 2));
      accum = 0xff & (c << 6);
    } else if (i % 4 === 3) {
      v.push(accum | c);
      accum = null;
    }
  }
  if (accum !== null) {
    v.push(accum);
  }
  return new Uint8Array(v).buffer;
};

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
      .map(
        (_, i) =>
          ("0".repeat(8) + v[i * 2].toString(2)).slice(-8) +
          ("0".repeat(8) + v[i * 2 + 1].toString(2)).slice(-8)
      )
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

export default (fk = "ab", tk = "ab") => {
    if (!from[fk]) throw new Error(`Invalid input format: ${fk}\nExpected: ${Object.keys(from).join(" ")}`);
    if (!to[tk]) throw new Error(`Invalid output format: ${tk}\nExpected: ${Object.keys(to).join(" ")}`);
    return v => to[tk](from[fk](v));
}
