const HEADER = [240, 0, 32, 41, 2, 12];
const DELIMITER = [247];


class Message {
    constructor() {}


    set_mode(mode) {
        return [
            ...HEADER,
            14, // Programmer / Live mode switch
            mode, // 0: Live mode, 1: Programmer mode
            DELIMITER
        ];
    }


    lighting(colourspecs) {
        return [
            ...HEADER,
            3, // LED lighting SysEx message
            ...colourspecs,
            DELIMITER
        ];
    }


    init_lighting() {
        let colourspecs = [];
        for(let index = 11; index <= 99; index++) {
            colourspecs.push(0, index, 0);
        }
        return this.lighting(colourspecs);
    }

    
    text_scrolling(loop, speed, colourspec, text) {
        let textcode = [];
        for(let i = 0; i < text.length; i++) {
            textcode.push(text[i].charCodeAt(0));
        }
        console.log(textcode);
        return [
            ...HEADER,
            7, // Text scrolling
            loop,
            speed,
            ...colourspec,
            ...textcode,
            DELIMITER
        ];
    }
}


module.exports = Message;