const VM = require("./VM");
const BasicInput = require("./BasicInput");
const BasicRenderer = require("./BasicRenderer");

const BasicHVM = ele => {
  const HVM = new VM();
  const inputter = new BasicInput();
  const renderer = new BasicRenderer(ele);
  HVM.addInputter(inputter.scan);
  HVM.addRenderer(renderer.render);
  return HVM;
};

Object.assign(BasicHVM, {
  VM,
  BasicInput,
  BasicRenderer
});

module.exports = BasicHVM;
