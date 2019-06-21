// import { tokenize, parser } from "./";

// const basicTokenizerTests = [
//     ["tokenize skips comment", "// Test Comment"],
//     ["tokenize skips basic comment with whitespace", "   // Test Comment  "],
//     ["tokenizes new lines", ["", ""]],
//     [
//         "tokenizes basic comment in with empty lines",
//         ["", "// Test Comment", "// Test line 2", ""]
//     ],
//     ["tokenizes @ symbol", "@"],
//     ["tokenizes @ symbol with name", "@S.FS-C;"],
//     ["tokenizes positive numeric value", "123"],
//     ["tokenizes positive numeric value with whitespace", " 123 "],
//     ["fail parsing number with decimal", "1.23", true],
//     ["tokenize instruction as text", "D=A-1"],
//     ["tokenizes neg", "-"],
//     [
//         "tokenize basic program",
//         [
//             "// Basic program",
//             "// -- Setup",
//             "  @R.-;1+=",
//             "  D=A",
//             "  @0",
//             "  M=D",
//             "  @2",
//             "  D=A",
//             "  @1",
//             "  M=D",
//             "// Almost max program",
//             "(MAX)",
//             "  @R_0",
//             "  D=M",
//             "  @R.1",
//             "  D=D-M",
//             "  D;JGT",
//             "",
//             "  @-123",
//             "  @-test",
//             "  @0",
//             ""
//         ]
//     ]
// ];

// basicTokenizerTests.forEach(([tag, data, expectThrow]) => {
//     it(tag, () => {
//         const wrap = () => {
//             const d = data instanceof Array ? data.join("\n") : data;
//             const tokens = tokenize(d);
//             expect(tokens).toMatchSnapshot();
//         };
//         if (expectThrow) return expect(wrap).toThrowErrorMatchingSnapshot();
//         wrap();
//     });
// });

// const basicParserTests = [
//     ["parser test", "D=M;JMP"],
//     ["parser test 2", "@12"]
// ];

// basicParserTests.forEach(([tag, data, expectThrow]) => {
//     it(tag, () => {
//         const wrap = () => {
//             const d = data instanceof Array ? data.join("\n") : data;
//             const tokens = tokenize(d);
//             const ast = parser(tokens, d);
//             expect(ast).toMatchSnapshot()
//         };
//         if (expectThrow) return expect(wrap).toThrowErrorMatchingSnapshot();
//         wrap();
//     });
// });

it('test', ()=>{})