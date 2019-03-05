function _localfirage(usersettings) {
    //Add an events API
    this.events = {};
    this.fire = function (e, args) {
        if (this.events[e]) {
            this.events[e].forEach((f, i) => {
                try {
                    f(args)
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };
    this.on = function (e, f) {
        _e = e.split(',');
        _e.forEach((i) => {
            if (!this.events[i]) this.events[e] = [];
            this.events[i].push(f);
        })
    };
    this.settings = {
        config: {},
    };
    Object.assign(this.settings, usersettings);
    // A simple firebase derived backend interface for a variety of applications. Localforage for firebase.
    // Assert that firebase has been included

    //Login to firebase
    firebase.initializeApp(this.settings.config);

    this.db = firebase.firestore();
    this.db.settings({
        timestampsInSnapshots: true
    });
    //retrieve data from path in settings
    this.dbroot = this.db;
    if (this.settings.path) {
        let spt = this.settings.path.split("/");
        for (let i = 0; i < spt.length; i++) {
            if (i % 2 == 0) {
                this.dbroot = this.dbroot.collection(spt[i]);
            } else {
                this.dbroot = this.dbroot.doc(spt[i]);
            }
        }
    }
    //that's it really hey
    this.tieCollection = function (col, obj) {
        col.onSnapshot(shot => {
            console.log("hi");
            shot.docChanges().forEach(change => {
                switch (change.type) {
                    case "added":
                        if (!obj[change.doc.id]) {
                            obj[change.doc.id] = {};
                        }
                    case "modified":
                        obj[change.doc.id] = change.doc.data();
                        break;
                    case "removed":
                        delete obj[change.doc.id];
                        break;
                }
            })
        })
    }
}


var localfirage = new _localfirage({
    config: {
        apiKey: "loremipsumreplaceme",
        authDomain: "somewhere.firebaseapp.com",
        databaseURL: "https://somewhere.firebaseio.com",
        projectId: "somewhere",
        storageBucket: "somewhere.appspot.com",
        messagingSenderId: "123123123213"
    },
})