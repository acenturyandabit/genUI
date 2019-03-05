// JQInit 2.4. Now nice and fancy and supports multiple instances of JQinit! No assumtion that dom is required to load.
try {
    if (JQInit.run) {
        console.log("Readying JQ...")
    };
} catch (e) {
    JQInit = {
        run: false,
        fWhenReady: [],
        start: function (_f) {
            if (this.run) { // If I have already been run...
                if (this.jQueryReady) {
                    _f();
                } else {
                    this.fWhenReady.push(_f);
                }
            } else {
                this.run = true;
                if (jQuery) {
                    this.jQueryReady = true;
                    _f()
                } else {
                    let scr = document.createElement("script");
                    scr.src = src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
                    scr.addEventListener("load", () => {
                        JQInit.fWhenReady.forEach((v, i) => {
                            v();
                        });
                    });
                }
            }
        }
    }
}
var dialogManager;
JQInit.start(function () {
    dialogManager = new _dialogManager()
});