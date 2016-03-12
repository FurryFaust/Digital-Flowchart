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

                val = (val + "00000000").substring(0, 8);
                input.children[1].value = val;
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

    document.getElementById("eval").onclick = function() {
        var expressions = document.querySelectorAll(".expressions > .set > .input");
        var waveforms = document.querySelectorAll(".expressions > .set > .waveform");

        for (var i = 0; i != expressions.length; i++) {
            var seq = evaluate(expressions[i].children[0].value);

            draw(waveforms[i], seq);
        }

    };

    document.getElementById("more_e").onclick = function() {
        var set = document.createElement("div");
        set.className = "set";

        var input = document.createElement("div");
        input.className = "input";

        var expr = document.createElement("input");
        expr.type        = "text";
        expr.size        = "10"; 
        expr.placeholder = "expression";
        expr.onfocus     = function() { enter(this); };
        expr.onblur      = function() { exit(this); };

        input.appendChild(expr);

        var waveform = document.createElement("div");
        waveform.className = "waveform";

        set.appendChild(input);
        set.appendChild(waveform);

        document.querySelector(".expressions").appendChild(set);
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

function enter(el) {
    el.size = (parseInt(el.size) + 2).toString();
}

function exit(el) {
    if (el.value.length != 0 && el.value.length >= 10) {
        el.size = el.value.length;
    } else {
        el.size = "10";
    }
}

function create_piece(piece) {
    var div = document.createElement("div");
    div.className = "piece " + piece;
    return div;
}

String.prototype.containsAny = function(search) {
    if (search instanceof Array) {
        for (var i = 0; i != search.length; i++) {
            if (this.toString().indexOf(search[i]) != -1) {
                return true;
            }
        }
    } else if (typeof search == "string") {
        return this.toString().indexOf(search) != -1;
    }

    return false;
}

var operators = ["1'", "0'", "11", "00", "10", "01", "(0)", "(1)", "1^1", "0^1", "1^0", "0^0", "1+1", "0+0", "1+0", "0+1"];
var to        = ["0", "1", "1", "0", "0", "0", "0", "1", "0", "1","1", "0", "1", "0", "1", "1"];

function evaluate(expr) {
    var build = "";
    expr = expr.split(" ").join("");
    console.log("Working now with" + expr);

    for (var i = 0; i != 8; i++) {
        var val = expr;
        for (var j = 0; j != ids.length; j++) {
            while (val.containsAny(ids[j])) {
                val = val.replace(ids[j], sequences[j].charAt(i));
            }
        }
        console.log("After ID Switch" + val);

        while (val.containsAny(operators)) {
            for (var k = 0; k != operators.length; k++) {
                if (val.containsAny(operators[k])) {
                    console.log("Replaced " + operators[k] + " to " + to[k]);
                    val = val.replace(operators[k], to[k]);

                    break;
                }
            }
        }

        build += val;
    }
    console.log(build);

    return build;
}

function replace(str, pattern, rep) {
    while (pattern.indexOf(rep) != -1) {
        str.replace(pattern, rep);
    }

    return str;
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
