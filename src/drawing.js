const main = require('./main.js');
const message = new (require('./message.js'))();
const Animation = require('./animation.js');

const animations = [];
const pixels = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
];


class Drawing {
    constructor() {}

    start() {
        // run every 0.05 sec
        setInterval(() => {
            let colourspecs = mix_animation();
            main.output(message.lighting(colourspecs));
        }, 50);
    }

    add_animation(filename, index, colors) {
        const x = index % 10 - 1;
        const y = 9 - (index / 10 | 0);
        if(x < 0 || 8 < x || y < 0 || 8 < y ) return;
        animations.push(new Animation(filename, x, y, colors));
    }
}

function mix_animation() {
    init_pixels();
    let length = animations.length;
    let remove_index = [];
    for(let i = 0; i < length; i++) {
        const animation = animations[i];
        const pxs = animation.get_pixels();
        if(pxs == null) {
            remove_index.push(i);
            continue;
        }
        for(let i = 0; i < 9; i++) for(let j = 0; j < 9; j++) {
            pixels[i][j] += pxs[i][j];
            if(pixels[i][j] > 127) pixels[i][j] = 3;
        }
    }
    for(let i = length - 1; i >= 0; i--) {
        if(remove_index.includes(i)) {
            animations.splice(i, 1);
            delete animation;
        }
    }
    const colourspecs = [];
    let index = 91;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            colourspecs.push(0, index, pixels[i][j]);
            index++;
        }
        index -= 19;
    }
    return colourspecs;
}

function init_pixels() {
    for(let i = 0; i < 9; i++) for(let j = 0; j < 9; j++) {
        pixels[i][j] = 0;
    }
}


module.exports = Drawing;