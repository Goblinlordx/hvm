const rLkup = obj =>
  Object.keys(obj).reduce((a, k) => {
    a[obj[k]] = k;
    return a;
  }, {});

const jmpLkup = {
  JGT: 1,
  JEQ: 2,
  JGE: 3,
  JLT: 4,
  JNE: 5,
  JLE: 6,
  JMP: 7
};

const jmpRLkup = rLkup(jmpLkup);

const storeLkup = {
  M: 1,
  D: 2,
  MD: 3,
  A: 4,
  AM: 5,
  AD: 6,
  AMD: 7
};

const storeRLkup = rLkup(storeLkup);

const computeLkup = {
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
  "D|M": parseInt("1010101", 2)
};

const computeRLkup = rLkup(computeLkup);

module.exports = { jmpLkup, jmpRLkup, storeLkup, storeRLkup, computeLkup, computeRLkup };
