const { jmpLkup, storeLkup, computeLkup } = require("@hvm/definitions");

const toBin = n => {
  const upper = (n >>> 8) & 0xff;
  const lower = n & 0xff;
  return new Uint8Array([upper, lower]);
};
const aPrefix = n => n & (0xffff >>> 1);
const cPrefix = n => n | (7 << (16 - 3));

module.exports = table => node => {
  if (node.type === "LABEL") return;
  if (node.type === "A_INS") {
    let value = node.value;
    if (value === null) {
      value = table[node.symbol].value;
    }
    return toBin(aPrefix(value));
  }
  if (node.type === "C_INS") {
    let store;
    let jump;
    if (node.store) {
      store = storeLkup[node.store];
      if (!store)
        throw new Error(
          `Invalid store instruction: ${node.store} [${node.loc[0]}:${
            node.loc[1]
          }]`
        );
    }
    if (node.jump) {
      jump = jmpLkup[node.jump];
      if (!jump)
        throw new Error(
          `Invalid jump instruction: ${node.jump} [${node.loc[0]}:${
            node.loc[1]
          }]`
        );
    }
    const compute = computeLkup[node.compute];
    if (!compute)
      throw new Error(
        `Invalid compute instruction: ${node.compute} [${node.loc[0]}:${
          node.loc[1]
        }]`
      );
    return toBin(cPrefix((compute << 6) | (store << 3)) | jump);
  }
  throw new Error(`Unknown node type: ${node.type}`);
};
