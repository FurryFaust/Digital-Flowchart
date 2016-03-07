var ids = [], sequences = [];

window.onload = function() {

    document.getElementById("gen").onclick = function() {
        ids = [], sequences = [];
        var inputs = document.querySelectorAll(".inputs > .set > .input");

        for (var i = 0; i != inputs.length; i++) {
            var input = inputs[i];

            var id  = input.children[0].value,
                val = input.children[1].value;

            if (id != "" && val != "" && ids.indexOf(id) == -1 ) {
                ids.push(id);
                sequences.push(val);
            } else {
                if (id != "" && ids.indexOf(id) != -1) {
                    input.children[1].value = "Duplicate ID";
                }
                ids.push("");
                sequences.push("");
            }
        }

        var waveforms = document.querySelectorAll(".inputs > .set > .waveform");
        for (var i = 0; i != ids.length; i++) {
            var sequence = sequences[i];

            draw(waveforms[i], sequence);
        }

        console.log(sequences);
    };

    document.getElementById("more_i").onclick = function() {
        var set = document.createElement("div");
        set.className = "set";

        var input = document.createElement("div");
        input.className = "input";

        var id = document.createElement("input");
        id.type        = "text";
        id.size        = "2";
        id.maxLength   = "1";
        id.placeholder = "id";
        id.onkeydown   = function(event) { 
            restrict(event, isAlpha);
        };

        var seq = document.createElement("input");
        seq.type        = "text";
        seq.size        = "8";
        seq.maxLength   = "8";
        seq.placeholder = "sequence";
        seq.onkeydown   = function(event) { 
            restrict(event, isBin);
        };

        input.appendChild(id);
        input.appendChild(seq);

        var waveform = document.createElement("div");
        waveform.className = "waveform";

        set.appendChild(input);
        set.appendChild(waveform);

        document.querySelector(".inputs").appendChild(set);
    };

};

function draw(el, sequence) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    for (var i = 0; i != sequence.length; i++) {
        var setting = sequence.charAt(i);
        var after   = i + 1 == sequence.length ? -1 : sequence.charAt(i + 1);
        var before  = i - 1 < 0 ? 0 : sequence.charAt(i - 1);

        // There is probably a better way to write this haha...
        if (setting == 1) {
            if (i == 0) {
                if (after == 1) {
                    el.appendChild(create_piece("middle"));
                } else if (after == -1) {
                    el.appendChild(create_piece("left"));
                } else {
                    el.appendChild(create_piece("right"));
                }
            } else {
                if (after == 1) {
                    if (before == 1) {
                        el.appendChild(create_piece("middle"));
                    } else {
                        el.appendChild(create_piece("left"));
                    }
                } else if (after == -1) {
                    if (before == 1) {
                        el.appendChild(create_piece("middle"));
                    } else {
                        el.appendChild(create_piece("left"));
                    }
                } else {
                    if (before == 1) {
                        el.appendChild(create_piece("right"));
                    } else {
                        el.appendChild(create_piece("high"));
                    }
                }
            }
        } else {
            el.appendChild(create_piece("low"));
        }
    }
}

function size(text) {
}

function create_piece(piece) {
    var div = document.createElement("div");
    div.className = "piece " + piece;
    return div;
}

function evaluate(expr) {
}

function restrict(event, limit) {
    if (!limit(event.keyCode) && "9 8 46 37 39".indexOf(event.keyCode) == -1) {
        event.preventDefault();
    }
}

function isAlpha(char) {
    return (char > 64 && char < 91) || (char > 96 && char < 123);
}

function isBin(char) {
    return "48 49".indexOf(char) != -1;
}
