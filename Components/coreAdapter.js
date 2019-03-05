//Registers exactly ONE operator into the given div.

/*
DEPENDENCIES:
eventAPI
scriptAssert


optional: 
localfirage

TODO:
change filescreen message




*/





function _item() {
    this.title = "";
    this.toSaveData = function () {
        return JSON.parse(JSON.stringify(this)); //remove all methods and return the object.
    }
    this.fromSaveData = function (item) {
        Object.assign(this, item);
    }
}

function guid() {
    let pool = "1234567890qwertyuiopasdfghjklzxcvbnm";
    tguid = "";
    for (i = 0; i < 4; i++) tguid += pool[Math.floor(Math.random() * pool.length)];
    return tguid;
}

function _core() {
    addEventAPI(this);
    let me = this;
    this._operator = undefined;
    this.settings = undefined;
    this.setDiv = function (div) {
        this._operator = {
            div: div
        };
        if (this.operator) this.registerOperator("", this.operator);
    };
    this.registerOperator = function (name, operator) {
        this.operatorName = name;
        this.operator = operator;
        if (this._operator) {
            this.liveOperator = new this.operator(this._operator, this.settings);
            //Load it!   
        }
    };
    this.items = {};
    //The usual event calls. this.fire("updateItem"); etc.
    this.insertItem = function (itm) {
        let nuid;
        do {
            nuid = guid();
        } while (this.items[nuid]);
        this.items[nuid] = itm;
        return nuid;
    }

    //Driving function
    this.drive = function () {
        document.addEventListener("DOMContentLoaded", () => {
            me.setDiv(document.body);
            // load settings from localstorage and fromsavedata the operator
            if (this.liveOperator) {
                settings = JSON.stringify(localStorage.getItem(this.operatorName + "_singleinstance_settings"));
                this.liveOperator.fromSaveData(settings);
            }
        })
        //ctrl s to save
        document.addEventListener("DOMContentLoaded", (e) => {
            document.body.addEventListener("keydown", (e) => {
                if (e.ctrlKey && e.key == "s") {
                    localStorage.setItem(this.operatorName + "_singleinstance_settings", JSON.stringify(this.liveOperator.toSaveData()));
                    e.preventDefault();
                }
            })
        })
    }
    this.path=undefined;
    this.preid = undefined;
    this.ccount = 0;
    this.rcount=0;
    this.update = function (id) {
        let val = core.items[id];
        let _val = JSON.parse(JSON.stringify(val));
        localfirage.path(localfirage.dbroot, me.path).doc(id).set(_val);
    }
    this.stackman = function (id) {
        if (id != me.preid && me.preid) {
            me.update(me.preid);
            this.rcount=0;
        }
        this.preid = id;
        this.ccount = 4;
        this.rcount++;
        if (this.rcount > 50) {
            this.ccount = 0;
            this.rcount = 0;
            me.update(id);
        }
    }
    setInterval(() => {
        if (this.ccount > -1) this.ccount -= 1;
        if (this.ccount == 0) {
            this.update(this.preid);
        }
    }, 100)

    this.lockFirebase = function (path) {
        this.path=path;
        //optional function. Requires firebase shenanigans.
        //onupdate fires update.
        let localChange = false;;
        core.on("updateItem", function (d) {
            if (!localChange) {
                me.stackman(d.id);
            } else localChange = false;
        })
        core.on("deleteItem", function (d) {
            localfirage.path(localfirage.dbroot, path).doc(d.id).delete();
        });

        localfirage.path(localfirage.dbroot, path).onSnapshot(shot => {
            shot.docChanges().forEach(change => {
                switch (change.type) {
                    case "added":
                    case "modified":
                        core.items[change.doc.id] = change.doc.data();
                        localChange = true;
                        core.fire("updateItem", {
                            id: change.doc.id
                        });
                        break;
                    case "removed":
                        localChange = true;
                        core.fire("deleteItem", {
                            id: change.doc.id
                        });
                        break;
                }
            })
        })
    }
    this.on("deleteItem", (d) => {
        delete this.items[d.id];
    })
}
var core = new _core();

//sequence:
/*
new _core()
this.registerOperator called from operator file 
this.settings set from driver file
this.setDiv called from DOMContentLoaded in driver call
ACTUAL LOADING
this.liveOperator.fromSaveData(some data);
*/