import { computeRLkup, jmpLkup } from "../definitions";
import { notDeepEqual } from "assert";

const aMask = 1 << 15;

export default ab => {
  if (ab.byteLength % 2) throw new Error(`Invalid length for opcodes`);
  const v = new Uint8array(ab);
  const nodes = [];
  for (let i = 0; i < v.length / 2; i++) {
    const instr = (ab[i * 2] << 8) | ab[i * 2 + 1];
    if (aMask & (instr === 0)) {
        nodes.push({
            type: "A_INS",
            value: instr,
        });
        continue;
    }

    let unofficial_mask;
    if ((instr >>> 13) !== 7) {
        unofficial_mask = (instr >>> 13) & 7;
    }
    
    const compute = computeRLkup[(instr >>> 6) & 0x7F];
    if (!compute) {
        nodes.push({
            type: "RAW",
            value: instr,
        })
        continue;
    }
    let store = storeLkup[(instr >>> 3) & 7];
    let jump = jmpLkup[instr & 7];
    nodes.push({
        type: "C_INS",
        store,
        compute,
        jump,
        unofficial_mask,
    });
    continue;
  }
  return nodes;
};
