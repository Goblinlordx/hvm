import VM from "./VM";
import BasicInput from "./BasicInput";
import BasicRenderer from "./BasicRenderer";

const BasicHVM = ele => {
    const HVM = new VM();
    const inputter = new BasicInput();
    const renderer = new BasicRenderer(ele);
    HVM.addInputter(inputter.scan);
    HVM.addRenderer(renderer.render);
    return HVM;
};

export { VM, BasicHVM, BasicInput, BasicRenderer };
