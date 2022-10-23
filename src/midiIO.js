const midi = require('midi');


class MidiIO {
    constructor() {
        this.input = new midi.Input();
        this.output = new midi.Output();
    }

    init() {
        let launchpad_input_index = 0;
        let launchpad_output_index = 0;
        console.log("[MIDI input ports]");
        for(let i = 0; i < this.input.getPortCount(); i++) {
            const name = this.input.getPortName(i);
            console.log(i, "-", name);
            if(name == "MIDIIN2 (LPX MIDI)") {
                launchpad_input_index = i;
            }
        }
        console.log("[MIDI output ports]");
        for(let i = 0; i < this.output.getPortCount(); i++) {
            const name = this.output.getPortName(i);
            console.log(i, "-", name);
            if(name == "MIDIOUT2 (LPX MIDI)") {
                launchpad_output_index = i;
            }
        }
        this.input.openPort(launchpad_input_index);
        this.output.openPort(launchpad_output_index);
        this.input.ignoreTypes(false, false, false);
    }
}


module.exports = MidiIO;