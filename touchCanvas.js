// V0.1

/*TODO:

*/




function _touchCanvasManager(userSettings) {
    let me = this;
    if (__globalTouchCanvasManager) {
        if (userSettings && userSettings.canvas) {
            __globalTouchCanvasManager.registerCanvas(this.settings.canvas); //register this canvas if provided.
        }
        return __globalTouchCanvasManager;
    } else {
        __globalTouchCanvasManager = this;
    }
    this.settings = {

    }
    Object.assign(this.settings, userSettings);
    //NON-DOM initialisation

    //DOM initalisation

    this._init = function () {
        //insert some CSS for us
        let touchCanvasStyle = document.createElement("style");
        touchCanvasStyle.innerHTML = `

        `;
        document.head.appendChild(touchCanvasStyle);
    };

    if (document.readyState != "loading") this._init();
    else document.addEventListener("DOMContentLoaded", () => this._init());

    this.registerCanvas = function (c) {
        return new _touchCanvas(c);
    }
    if (userSettings && userSettings.canvas) {
        this.registerCanvas(this.settings.canvas); //register this canvas if provided.
    }

    this.getMousePos=function (canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}
}

//Or just a single touchcanvas will do
var __globalTouchCanvasManager;

function _touchCanvas(c) {
    let me = this;
    if (!__globalTouchCanvasManager) __globalTouchCanvasManager = new _touchCanvasManager();
    //add CSS, if CSS not yet added
    //quick polyfill
    // Get a regular interval for drawing to the screen
    window.requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    //DOM manipulation
    this.canvas = c;
    this.clearButton = document.createElement("button");
    this.canvas.parentElement.appendChild(this.clearButton);
    this.canvas.parentElement.appendChild(this.canvas);
    this.clearButton.style.position = "absolute";
    this.clearButton.innerText="Clear";
    this.clearButton.addEventListener("click", (e) => {
        this.canvas.width = this.canvas.width; //quick force redraw
        //clear all points
        me.data = [];
    })
    // Set up mouse events for drawing
    this.drawing = false;
    this.mousePos = {
        x: 0,
        y: 0
    };
    this.lastPos = this.mousePos;
    this.canvas.addEventListener("mousedown", function (e) {
        me.drawing = true;
        me.lastPos = __globalTouchCanvasManager.getMousePos(me.canvas, e);
    }, true);
    me.canvas.addEventListener("mouseup", function (e) {
        me.drawing = false;
    }, true);
    
    me.canvas.addEventListener("mousemove", function (e) {
        me.mousePos = __globalTouchCanvasManager.getMousePos(me.canvas, e);
    }, true);

    //set up touch events
    me.canvas.addEventListener("touchstart", function (e) {
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        me.canvas.dispatchEvent(mouseEvent);
    }, false);
    me.canvas.addEventListener("touchend", function (e) {
        let mouseEvent = new MouseEvent("mouseup", {});
        me.canvas.dispatchEvent(mouseEvent);
    }, false);
    me.canvas.addEventListener("touchmove", function (e) {
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        me.canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == me.canvas) {
            try {
                e.preventDefault();
            }catch (err){}
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        try {
            e.preventDefault();
        }catch (err){}
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        try {
            e.preventDefault();
        }catch (err){}
    }, false);

    this.drawLoop=function(){
        requestAnimFrame(me.drawLoop);
		if (me.drawing) {
			me.ctx.moveTo(me.lastPos.x, me.lastPos.y);
			me.ctx.lineTo(me.mousePos.x, me.mousePos.y);
			me.ctx.stroke();
            me.lastPos = me.mousePos;
            me.data.push(me.mousePos);
		}
    }
    this.drawLoop();

    this.data = [];
    this.ctx = c.getContext('2d');
    this.ctx.strokeStyle = "#222222";
    this.ctx.lineWith = 2;



}