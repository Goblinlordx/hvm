module.exports = class BasicInput {
    constructor() {
        const keys = [];
        const keydown = e => keys.push(e.keyCode);
        const keyup = e => {
            let idx = 0;
            keys.some((code, i) => code === e.keyCode && (idx = i) && true);
            return idx || 0;
        };
        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);
        this.scan = () => (!keys.length ? 0 : keys[keys.length - 1]);
    }
}
