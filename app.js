var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var NX = 20;
var NY = 32;

var X_OFFSET = 100;
var Y_OFFSET = 0;

var RECT_WIDTH = 20;
var RECT_HEIGHT = 20;

var KonvaStage = null;
var KonvaMainLayer = null;

var MOUSE_DOWN = false;
var MOUSE_UP = true;

var MODE = "SELECT";

var SELECTED_SQUARE_MASK = new Array(NX*NY).fill(0);

function initialize(callbackFunction){
    if(document.readyState != 'loading') {
        callbackFunction(event);
    } else {
        document.addEventListener("DOMContentLoaded", callbackFunction);
    }
}

function printSelectedMask() {
    document.getElementById("selected-mask").innerHTML = "{"+ SELECTED_SQUARE_MASK + "}";
}

function toggleMode() {
    MODE = MODE === "SELECT" ? "CLEAR" : "SELECT";
    document.getElementById("mode-label").innerHTML = "MODE IS: "+MODE;
}

function triggerMouseDown() {
    MOUSE_DOWN = true;
    MOUSE_UP = false;
}

function triggerMouseUp() {
    MOUSE_DOWN = false;
    MOUSE_UP = true;
}

function initializeKonva() {
    KonvaStage = new Konva.Stage({
        container: 'container',
        width: WIDTH,
        height: HEIGHT
    });

    KonvaMainLayer = new Konva.Layer();
}

function addSprite() {
    for (var i = 0; i < NY; i++) {
        for (var j = 0; j < NX; j++) {
            var x = j*RECT_WIDTH + X_OFFSET;
            var y = i*RECT_HEIGHT + Y_OFFSET;
            var idx = (i*NX+j).toString();

            var rect = new Konva.Rect({
                x: x,
                y: y,
                width: RECT_WIDTH,
                height: RECT_HEIGHT,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1,
                id: idx
            });

            rect.on('mouseover', function(evt) {
                var fill = this.fill();
                if (MOUSE_DOWN) {
                    fill = MODE === "SELECT" ? 'green' : 'white';
                    if (fill == 'green') {
                        SELECTED_SQUARE_MASK[parseInt(this.attrs.id)] = 1;
                    } else {
                        SELECTED_SQUARE_MASK[parseInt(this.attrs.id)] = 0;
                    }
                }
                this.fill(fill);
                KonvaMainLayer.draw();
            });

            rect.on('click', function(evt) {
                var fill = this.fill();
                if (MODE === "SELECT") {
                    fill = 'green';
                } else if (MODE === "CLEAR") {
                    fill = 'white';
                }
                if (fill == 'green') {
                    SELECTED_SQUARE_MASK[parseInt(this.attrs.id)] = 1;
                } else {
                    SELECTED_SQUARE_MASK[parseInt(this.attrs.id)] = 0;
                }
                this.fill(fill);
                KonvaMainLayer.draw();
            });
        
            // add the shape to the layer
            KonvaMainLayer.add(rect);
        }
    }
}

function finalize() {
    // add the layer to the stage
    KonvaStage.add(KonvaMainLayer);
}

initialize(event => {
    initializeKonva();
    addSprite();
    finalize();
})
