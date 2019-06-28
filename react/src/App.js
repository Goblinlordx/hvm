// import React, { Component } from "react";
// import logo from './logo.svg';
// import "./App.css";

// const basicProgram = `0000000000000000
// 1111110000010000
// 0000000000000001
// 1111010011010000
// 0000000000001010
// 1110001100000001
// 0000000000000001
// 1111110000010000
// 0000000000001100
// 1110101010000111
// 0000000000000000
// 1111110000010000
// 0000000000000010
// 1110001100001000
// 0000000000001110
// 1110101010000111`

// console.log(VM.regView, VM.heapView);
// VM.loadProgram("hack", basicProgram);
// console.log(VM.regView, VM.heapView);
// for(var i=0; i<20; i++) {
// VM.machine.step();
// console.log(VM.regView);
// }

// class App extends Component {
//     render() {
//         return (
//             <div className="App">
//                 {/* <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p> */}
//             </div>
//         );
//     }
// }

// export default App;

import { BasicHVM, VM } from "./hvm";

const cvs = document.createElement("canvas");
cvs.height = 256;
cvs.width = 512;
document.body.appendChild(cvs);

window.vm = new BasicHVM();

