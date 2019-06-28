/* eslint-disable */
import { abtoa, atoab, copyAB, hacktoab } from "../utils";

function mask(length) {
    return Array.apply(null, { length }).reduce((a, _, i) => a + (1 << i), 0);
}

const INSTRUCTION_SIZE = 2; // 2-byte instructions
const Kb = 1024; // Kilobyte size
const ROM_SIZE = 32 * Kb * INSTRUCTION_SIZE; // 32k ROM chip
const RAM_SIZE = 16 * Kb * INSTRUCTION_SIZE; // 16k address space
const SCREEN_SIZE = 8 * Kb * INSTRUCTION_SIZE; // 8k address space
// Registers placed in heap space to allow external introspection
const REGISTER_SIZE = 4 * INSTRUCTION_SIZE; // 4 registers at 2-bytes each (Keyboard, A, D, PC)
const MEM_SIZE = RAM_SIZE + SCREEN_SIZE + REGISTER_SIZE;

const consts = {
    ROM_OFFSET: 0
};
consts.RAM_OFFSET = ROM_SIZE;
consts.SCREEN_OFFSET = consts.RAM_OFFSET + RAM_SIZE;
consts.REG_OFFSET = consts.SCREEN_OFFSET + SCREEN_SIZE;
consts.AC_MASK = 1 << 15;
consts.MASK16 = mask(16); // 16 bit mask
consts.MASK7 = mask(7); // 7 bit mask
consts.MASK6 = mask(6); // 6 bit mask
consts.MASK3 = mask(3); // 3 bit mask
consts.NMASK = mask(1) << 15;

const dataFormat = {
    hack: str => hacktoab(str),
    b64: str => atoab(str),
    ab: ab => ab,
    bin: str => btoab(str)
};

const formatToAb = (format, input) => {
    if (!dataFormat[format]) {
        throw new Error("Invalid format received:", format);
    }
    return dataFormat[format](input);
};

class VM {
    constructor() {
        const heap = new ArrayBuffer(
            ROM_SIZE + RAM_SIZE + SCREEN_SIZE + REGISTER_SIZE
        );
        const renderers = [];
        const inputters = [];
        Object.assign(this, {
            heap,
            heapView: new Uint16Array(heap),
            romView: new Uint16Array(
                heap,
                consts.ROM_OFFSET,
                ROM_SIZE / INSTRUCTION_SIZE
            ),
            memView: new Uint16Array(
                heap,
                consts.RAM_OFFSET,
                MEM_SIZE / INSTRUCTION_SIZE
            ),
            ramView: new Uint16Array(
                heap,
                consts.RAM_OFFSET,
                RAM_SIZE / INSTRUCTION_SIZE
            ),
            fbView: new Uint16Array(
                heap,
                consts.SCREEN_OFFSET,
                SCREEN_SIZE / 2
            ),
            regView: new Int16Array(heap, consts.REG_OFFSET, REGISTER_SIZE / 2),
            addRenderer(renderFn) {
                if (renderers.some(renderer => renderer === renderFn))
                    throw new Error("Renderer already registered");
                renderers.push(renderFn);
                return () => {
                    const idx = renders.indexOf(renderFn);
                    if (idx === -1) return;
                    renderers.splice(idx, 1);
                };
            },
            render() {
                renderers.forEach(fn => fn(this.fbView));
            },
            addInputter(inputFn) {
                if (inputters.some(inputter => inputter === inputFn))
                    throw new Error("Renderer already registered");
                inputters.push(inputFn);
                return () => {
                    const idx = inputters.indexOf(inputFn);
                    if (idx === -1) return;
                    inputters.splice(idx, 1);
                };
            },
            scanInput() {
                inputters.some(fn => fn());
            }
        });
        this.machine = hvm(window, consts, heap);
    }
    dumpHeap() {
        return this.heapView.slice();
    }
    dumpROM() {
        return this.romView.slice();
    }
    dumpRAM() {
        return this.ramView.slice();
    }
    dumpMEM() {
        return this.memView.slice();
    }
    dumpFrameBuffer() {
        return this.fbView.slice();
    }
    dumpRegisters() {
        return this.regView.slice();
    }
    dumpKeyboard() {
        return this.regView[0];
    }
    dumpA() {
        return this.regView[1];
    }
    dumpD() {
        return this.regView[2];
    }
    dumpPC() {
        return this.regView[3];
    }
    setKeyboard(v) {
        this.regView[0] = v;
    }
    clearAll() {
        const view = new Uint32Array(this.heap);
        view.fill(0);
    }
    clearMem() {
        this.memView.fill(0);
        this.regView.fill(0);
    }
    loadProgram(format, input) {
        const ab = formatToAb(format, input);
        this.clearAll();
        copyAB(ab, this.heap);
    }
    loadState(format, input) {
        this.clearMem();
        const ab = formatToAb(format, input);
        copyAB(ab, this.memView);
    }
}

function hvm(stdlib, ffi, heap) {
    "use asm";
    // Architectural simulation variables
    var MEM16 = new stdlib.Int16Array(heap);
    var ROM_OFFSET = ffi.ROM_OFFSET | 0;
    var RAM_OFFSET = ffi.RAM_OFFSET | 0;
    var SCREEN_OFFSET = ffi.SCREEN_OFFSET | 0;
    var REG_OFFSET = ffi.REG_OFFSET | 0;
    var KB = 0;
    var A = 0;
    var D = 0;
    var PC = 0;

    var EMU_ALU = 1;
    // VM operational variables
    var opcode = 0;
    var T1 = 0;
    var CYCLES = 0;
    var COMP_RES = 0;
    var COMP_CODE = 0;
    var DEST_CODE = 0;
    var JMP_CODE = 0;
    var AC_MASK = ffi.AC_MASK | 0;
    var MASK16 = ffi.MASK16 | 0;
    var MASK7 = ffi.MASK7 | 0;
    var MASK6 = ffi.MASK6 | 0;
    var MASK3 = ffi.MASK3 | 0;
    var NMASK = ffi.NMASK | 0;

    // ALU vars
    var X = 0;
    var Y = 0;
    var O = 0;

    function GET_KB() {
        return MEM16[REG_OFFSET >> 1] | 0;
    }
    function GET_A() {
        return MEM16[(REG_OFFSET + 2) >> 1] | 0;
    }
    function SET_A(value) {
        value = value | 0;
        MEM16[(REG_OFFSET + 2) >> 1] = value;
    }
    function GET_D() {
        return MEM16[(REG_OFFSET + 4) >> 1] | 0;
    }
    function SET_D(value) {
        value = value | 0;
        MEM16[(REG_OFFSET + 4) >> 1] = value;
    }
    function GET_PC() {
        return MEM16[(REG_OFFSET + 6) >> 1] | 0;
    }
    function SET_PC(value) {
        value = value | 0;
        MEM16[(REG_OFFSET + 6) >> 1] = value;
    }
    function GET_MEM(address) {
        address = address | 0;
        return MEM16[(RAM_OFFSET + (address << 1)) >> 1] | 0;
    }
    function SET_MEM(address, v) {
        address = address | 0;
        v = v | 0;
        MEM16[(RAM_OFFSET + (address << 1)) >> 1] = v;
    }
    function INC_PC() {
        SET_PC(((GET_PC() | 0) + 1) | 0);
    }
    function FETCH() {
        return MEM16[((GET_PC() | 0) << 1) >> 1] | 0;
    }
    function JMP(result, jmp_code) {
        result = result | 0;
        jmp_code = jmp_code | 0;
        if ((jmp_code | 0) == 1) {
            if ((result | 0) > 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 2) {
            if ((result | 0) == 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 3) {
            if ((result | 0) >= 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 4) {
            if ((result | 0) < 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 5) {
            if ((result | 0) != 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 6) {
            if ((result | 0) <= 0) {
                SET_PC(GET_A() | 0);
                return;
            }
        } else if ((jmp_code | 0) == 7) {
            SET_PC(GET_A() | 0);
            return;
        }
        // No jump, increment once
        INC_PC();
    }

    function COMPUTE_ALU(code) {
        code = code | 0;
        if (((code >>> 5) & 1) == 1) {
            X = 0;
        } else {
            X = GET_D() | 0;
        }

        if (((code >>> 4) & 1) == 1) {
            X = ~X;
        }

        if (((code >>> 3) & 1) == 1) {
            Y = 0;
        } else if (((code >>> 6) & 1) == 1) {
            Y = GET_MEM(GET_A() | 0) | 0;
        } else {
            Y = GET_A() | 0;
        }

        if (((code >>> 2) & 1) == 1) {
            Y = ~Y;
        }

        if (((code >>> 1) & 1) == 1) {
            O = (X + Y) | 0;
        } else {
            O = X & Y;
        }

        if ((code & 1) == 1) {
            O = ~O;
        }
        return O | 0;
    }
    function STORE(result, dest) {
        result = result | 0;
        dest = dest | 0;
        if ((dest & 1) > 0) {
            SET_MEM(GET_A() | 0, result);
        }
        if ((dest & (1 << 1)) > 0) {
            SET_D(result);
        }
        if ((dest & (1 << 2)) > 0) {
            SET_A(result);
        }
    }

    function step() {
        opcode = FETCH() | 0;
        if ((opcode & AC_MASK) == 0) {
            SET_A(~AC_MASK & opcode);
            INC_PC();
        } else {
            JMP_CODE = opcode & MASK3;
            DEST_CODE = (opcode >>> 3) & MASK3;
            COMP_CODE = (opcode >>> 6) & MASK7;
            COMP_RES = COMPUTE_ALU(COMP_CODE) | 0; // Do computation
            STORE(COMP_RES, DEST_CODE);
            JMP(COMP_RES, JMP_CODE);
        }
    }
    function step_cycles(count) {
        count = count | 0;
        for (CYCLES = 0; (CYCLES | 0) < (count | 0); CYCLES = (CYCLES + 1) | 0)
            step();
    }
    return {
        step,
        step_cycles
    };
}

export default VM;
