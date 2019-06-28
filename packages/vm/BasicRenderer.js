const FB_ELE_SIZE = 16;
const PIXEL_ON = 0xFF000000;
const PIXEL_OFF = 0xFFFFFFFF;
module.exports = class BasicRenderer {
    constructor(ele) {
        ele.height = 256;
        ele.width = 512;
        const ctx = ele.getContext("2d");
        const ImageBuffer = new ImageData(512, 256);
        const writeView = new Uint32Array(ImageBuffer.data.buffer);
        const fb1tofb32 = (fbView1, fbView32) => {
            fbView1.forEach((n, i) => {
                let mask = 1 << 15;
                for (let j = 0; j < FB_ELE_SIZE; j++) {
                    fbView32[(i* FB_ELE_SIZE) + j] =
                        (n & mask) === 0 ? PIXEL_OFF : PIXEL_ON;
                    mask = mask >>> 1;
                }
            });
        };
        this.render = fb => {
            fb1tofb32(fb, writeView);
            ctx.putImageData(ImageBuffer, 0, 0);
        };
    }
}
