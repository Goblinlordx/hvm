import "./index.css";
import { BasicHVM } from "./hvm";
import registerServiceWorker from "./registerServiceWorker";
registerServiceWorker();

const ele = document.createElement("canvas");
ele.style.width = "100%";
ele.style.position = "absolute";
ele.style.top = "0";
ele.style.left = "0";
document.body.appendChild(ele);

const output = document.createElement("h1");
document.body.appendChild(output);

const VM = new BasicHVM(ele);
VM.loadProgram(
    "hack",
    `0000000000000000
1111110000010000
0000000000010111
1110001100000110
0000000000010000
1110001100001000
0100000000000000
1110110000010000
0000000000010001
1110001100001000
0000000000010001
1111110000100000
1110111010001000
0000000000010001
1111110000010000
0000000000100000
1110000010010000
0000000000010001
1110001100001000
0000000000010000
1111110010011000
0000000000001010
1110001100000001
0000000000010111
1110101010000111
`
);

try {
const fill = "0".repeat(16);
const num = n => (fill + n.toString(2)).slice(-16);
VM.loadState("hack", num(128));
VM.render();
let cyclesPerMS = 1;
Promise.resolve().then(() => {
    return Array.apply(null, { length: 3000 }).reduce((a, i) => 
        a.then(() => 
            new Promise(resolve => setTimeout(() => {
                VM.machine.step_cycles(cyclesPerMS * 1000/30);
                VM.render();
                resolve();
            }, 1000/30))
        )
    , Promise.resolve());
});

window.VM = VM;
} catch (e) {
    output.textContent = JSON.stringify(e.stackTrace);
}
