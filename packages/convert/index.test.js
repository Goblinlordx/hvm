const convert = require(".");

it("is a function", () => {
  expect(typeof convert).toBe("function");
});

it("does not error when calling with no parameters", () => {
  let err;
  try {
    convert();
  } catch (e) {
    err = e;
  }
  expect(err).toBeUndefined();
});

it("causes an error when calling with type that doesn't exist", () => {
  let err;
  try {
    convert("asdf");
  } catch (e) {
    err = e;
  }
  expect(err.toString()).toMatchInlineSnapshot(`
                                            "Error: Invalid input format: asdf
                                            Expected: utf8 ab hack bin b64"
                      `);
});

it("converts from/to b64 properly", () => {
  const b64 = convert("utf8", "b64");
  const utf8 = convert("b64", "utf8");
  const to = b64("Test Hello World");
  const from = utf8(to);
  expect(to).toMatchInlineSnapshot(
    `"VGVzdCBIZWxsbyBXb3JsZA=="`
  );
  expect(from).toMatchInlineSnapshot(
    `"Test Hello World"`
  );
});

it("converts to hack properly", () => {
  const hack = convert("utf8", "hack");
  const utf8 = convert("hack", "utf8");
  const to = hack("Test Hello World");
  const from = utf8(to);
  expect(to).toMatchInlineSnapshot(`
                                    "0101010001100101
                                    0111001101110100
                                    0010000001001000
                                    0110010101101100
                                    0110110001101111
                                    0010000001010111
                                    0110111101110010
                                    0110110001100100"
                  `);
  expect(from).toMatchInlineSnapshot(`"Test Hello World"`);
});

it("converts to binary buffer properly", () => {
  const bin = convert("utf8", "bin");
  const utf8 = convert("bin", "utf8");
  const to = bin("Test Hello World");
  const from = utf8(to);
  expect(to).toMatchInlineSnapshot(`
                                Object {
                                  "data": Array [
                                    84,
                                    101,
                                    115,
                                    116,
                                    32,
                                    72,
                                    101,
                                    108,
                                    108,
                                    111,
                                    32,
                                    87,
                                    111,
                                    114,
                                    108,
                                    100,
                                  ],
                                  "type": "Buffer",
                                }
                `);
  expect(from).toMatchInlineSnapshot(`"Test Hello World"`);
});

it("converts to ArrayBuffer properly", () => {
  const ab = convert("utf8", "ab");
  const utf8 = convert("ab", "utf8");
  const to = ab("Test Hello World");
  const from = utf8(to);
  expect(new Uint8Array(to)).toMatchInlineSnapshot(`
                        Uint8Array [
                          84,
                          101,
                          115,
                          116,
                          32,
                          72,
                          101,
                          108,
                          108,
                          111,
                          32,
                          87,
                          111,
                          114,
                          108,
                          100,
                        ]
            `);
  expect(from).toMatchInlineSnapshot(`"Test Hello World"`);
});
