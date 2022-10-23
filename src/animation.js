const fs = require('fs');


class Animation {
    constructor(filename, center_x, center_y, colors) {
        const data = JSON.parse(fs.readFileSync("./animations/"+filename+".json"));
        this.name = data.name;
        this.type = data.type;
        this.blend = data.blend;
        this.animation = data.animation;
        this.index = 0;
        this.center_x = center_x;
        this.center_y = center_y;
        this.colors = [];
        for(let i = 0; i < colors.length; i++) {
            if(colors[i] == 128) this.colors.push(Math.floor(Math.random() * 128));
            else this.colors.push(colors[i]);
        }
    }

    get_pixels() {
        if(this.index >= this.animation.length) return null;
        const pixels = [];
        if(this.type == "absolute") {
            for(let i = 0; i < 9; i++) {
                const row = [];
                for(let j = 0; j < 9; j++) {
                    let p = this.animation[this.index][i][j];
                    if(p > 127) p = this.color[p-128];
                    row.push(p);
                }
                pixels.push(row);
            }
        }
        else if(this.type == "relative") {
            for(let y = -this.center_y + 8; y < -this.center_y + 17; y++) {
                const row = [];
                for(let x = -this.center_x + 8; x < -this.center_x + 17; x++) {
                    let p = this.animation[this.index][y][x];
                    if(p > 127) p = this.colors[p-128];
                    row.push(p);
                }
                pixels.push(row);
            }
        }
        this.index++;
        return pixels;
    }
}


module.exports = Animation;