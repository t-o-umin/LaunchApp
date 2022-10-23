const midiIO = new (require('./midiIO.js'))();
const message = new (require('./message.js'))();
const reversi = new (require('./reversi.js'))();
const drawing = new (require('./drawing.js'));


// init midi input/output
midiIO.init();
midiIO.output.sendMessage(message.set_mode(1));    
midiIO.output.sendMessage(message.init_lighting());


// output midi message
exports.output = function(msg) {
    midiIO.output.sendMessage(msg);
}


// exit processing
process.on("SIGINT", () => {
    midiIO.output.sendMessage(message.init_lighting());
    midiIO.input.closePort();
    midiIO.output.closePort();
    process.exit(0);
});


// receive midi message
const pressed = new Array(81);
pressed.fill(false);
midiIO.input.on('message', (deltaTime, msg) => {
    if(msg[2] != 0 && !pressed[msg[1]-11]) {
        pressed[msg[1]-11] = true;
        on_pressed(msg);
    }
    else if(msg[2] == 0 && pressed[msg[1]-11]){
        pressed[msg[1]-11] = false;
    }
});


// called when pad is pressed
function on_pressed(msg) {
    // reversi.input(msg[1]);
    if(msg[1] % 2 == 0) 
        drawing.add_animation("ripple", msg[1], [128]);
    else 
        drawing.add_animation("crossline", msg[1], [128]);    
}


// reversi.init();
drawing.start();