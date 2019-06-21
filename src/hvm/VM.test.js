import path from "path";
import fs from "fs";

import { VM } from "./";
import { SIGABRT } from "constants";

const loadExample = name => {
    const prog = fs.readFileSync(
        path.join(__dirname, "..", "examples", name + ".hack"),
        "utf8"
    );
    return prog;
};

const abSlice = (ab, start, end) =>
    ab.slice(start, end).reduce((a, n) => {
        a.push(n);
        return a;
    }, []);

it("works as constructor and starts at PC 0", () => {
    const vm = new VM();
    expect(vm.dumpPC()).toEqual(0);
});

it("step incremements PC with ", () => {
    const vm = new VM();
    vm.machine.step();
    expect(vm.dumpPC()).toEqual(1);
});

it("can load hack format into ROM", () => {
    const vm = new VM();
    const expected = Array.apply(null, { length: 16 }).map((_, i) => i);
    const hackFormat = expected
        .map(n => ("0".repeat(16) + n.toString(2)).slice(-16))
        .join("\n");
    vm.loadProgram("hack", hackFormat);
    const arr = abSlice(vm.dumpROM(), 0, 16);
    expect(arr).toEqual(expected);
});

it("can load state", () => {
    const vm = new VM();
    const expected = Array.apply(null, { length: 16 }).map((_, i) => i);
    const hackFormat = expected
        .map(n => ("0".repeat(16) + n.toString(2)).slice(-16))
        .join("\n");
    vm.loadState("hack", hackFormat);
    const arr = abSlice(vm.dumpRAM(), 0, 16);
    expect(arr).toEqual(expected);
});

it("can run A-instruction", () => {
    const vm = new VM();
    const A = "0000000011111111"; // "A" bit to 0 + 255
    vm.loadProgram("hack", A);
    vm.machine.step();
    expect(vm.dumpA()).toEqual(255);
});

it('can run "Max" program', () => {
    const program = loadExample("Max");
    const baseState = ["0".repeat(15) + "1", "0".repeat(14) + "10"].join("\n"); // R0 = 1, R1 = 2
    const vm = new VM();
    vm.loadProgram("hack", program);
    vm.loadState("hack", baseState);
    vm.machine.step_cycles(12);
    expect(vm.dumpA()).toEqual(2);
    expect(vm.dumpD()).toEqual(2);
    expect(vm.dumpPC()).toEqual(14);
    expect(abSlice(vm.dumpRAM(), 0, 3)).toEqual([1, 2, 2]); // Expected output: R0 = 1, R1 = 2, R3 = 2
});

it('can run "Add" program', () => {
    const program = loadExample("Add");
    const vm = new VM();
    vm.loadProgram("hack", program);
    vm.machine.step_cycles(5);
    expect(abSlice(vm.dumpRegisters())).toEqual([0, 0, 5, 5]);
});

it('can run "Rect" program', () => {
    const program = loadExample("Rect"); // Rect fills frame buffer with pixels of width: 16 and height: R0
    const vm = new VM();
    vm.loadProgram("hack", program);
    vm.loadState("hack", "0".repeat(14) + "10"); // Set R0 = 2 (so that rect will fill 2 rows)
    vm.machine.step_cycles(37);
    const fb = vm.dumpFrameBuffer();
    expect(abSlice(vm.dumpRegisters())).toEqual([0, 23, 0, 24]);
    expect(abSlice(fb, 0, 1)).toEqual([0xffff]); // First row 16 pixels wide filled
    expect(abSlice(fb, 32, 33)).toEqual([0xffff]); // Second row 16 pixels wide filled
});
