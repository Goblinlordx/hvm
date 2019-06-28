import assemble from ".";
import fs from "fs";
import { abtohack } from "../utils";

const ADD_ASM = String(fs.readFileSync("./src/examples/Add.asm"));
const ADD_HACK = String(fs.readFileSync("./src/examples/Add.hack"));
const MAX_ASM = String(fs.readFileSync("./src/examples/Max.asm"));
const MAX_HACK = String(fs.readFileSync("./src/examples/Max.hack"));
const RECT_ASM = String(fs.readFileSync("./src/examples/Rect.asm"));
const RECT_HACK = String(fs.readFileSync("./src/examples/Rect.hack"));
const PONG_ASM = String(fs.readFileSync("./src/examples/Pong.asm"));
const PONG_HACK = String(fs.readFileSync("./src/examples/Pong.hack"));

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
