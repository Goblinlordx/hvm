const assemble = require(".");
const fs = require("fs");
const convert = require("@hvm/convert");
const abtohack = convert('ab', 'hack');

const ADD_ASM = String(fs.readFileSync(require.resolve("@hvm/examples/Add.asm")));
const ADD_HACK = String(fs.readFileSync(require.resolve("@hvm/examples/Add.hack")));
const MAX_ASM = String(fs.readFileSync(require.resolve("@hvm/examples/Max.asm")));
const MAX_HACK = String(fs.readFileSync(require.resolve("@hvm/examples/Max.hack")));
const RECT_ASM = String(fs.readFileSync(require.resolve("@hvm/examples/Rect.asm")));
const RECT_HACK = String(fs.readFileSync(require.resolve("@hvm/examples/Rect.hack")));
const PONG_ASM = String(fs.readFileSync(require.resolve("@hvm/examples/Pong.asm")));
const PONG_HACK = String(fs.readFileSync(require.resolve("@hvm/examples/Pong.hack")));

it("assembles Add program correctly", () => {
  expect(abtohack(assemble(ADD_ASM))).toEqual(ADD_HACK);
});

it("assembles Max program correctly", () => {
  expect(abtohack(assemble(MAX_ASM))).toEqual(MAX_HACK);
});

it("assembles Rect program correctly", () => {
  expect(abtohack(assemble(RECT_ASM))).toEqual(RECT_HACK);
});

it("assembles Pong program correctly", () => {
  expect(abtohack(assemble(PONG_ASM))).toEqual(PONG_HACK);
});
