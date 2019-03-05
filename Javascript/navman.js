//v2.2 many bug fixes.

/*
page structure:
page.div: the div to show.
page.styling: a <style> element. Optional.
//This isn't a mobile manager. It's a single page app manager.
*/

function _navman(){
    //Add an event library.
    let me=this;
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
    //Create the navigation stack to handle 'back' calls.
    this.navStack=[];
    this.pages={};
    document.addEventListener("DOMContentLoaded", function(){
        window.history.pushState({}, '');
        for (i in me.pages){
            document.body.appendChild(me.pages[i].div);
            if (me.pages[i].style)document.body.appendChild(me.pages[i].style);
        }
    })

    this.addpage=function(name,page){
        let _page=page;
        if (typeof page=='function')_page=new page();
        this.pages[name]=_page;
    }

    this.wrap=function(div,settings){
        //Wraps the div in contextually relevant fluff to ensure that it can be navigated away from, etc.
        //return _div;
    }

    this.navigateTo=function(pageName,params){
        //ready arguments for firing the transition event.
        let args = {
            prev: this.navStack[this.navStack.length - 1],
            dest: pageName,
            cancel: () => {
                args._cancel = true;
            },
            _cancel: false,
            data:params
        };
        if (!pageName) {
            args.dest = this.navStack[this.navStack.length - 1];
        } else {
            args.dest = pageName;
        }
        this.fire('transition', args);
        
        if (!args._cancel) {
            //hide all other pages
            for (let pg in this.pages){
                this.pages[pg].div.style.display="none";
            }
            if (!pageName) {
                window.history.pushState({}, ''); // Pop the state.
                this.navStack.pop();
                this.pages[this.navStack[this.navStack.length - 1]].div.style.display="block";
            } else {
                this.navStack.push(pageName);
                this.pages[this.navStack[this.navStack.length - 1]].div.style.display="block";
            }
        }
        //show the required page
        //push it onto the stack
    }

    this.back=function(){
        // pop the stack and move backwards
        this.navigateTo();
    }

    window.addEventListener('popstate', function () {
        me.back();
    })
}


var navman= new _navman();


/*changelog:
1.2 Now with cancelable navigation.
2.0 Now much more structured owo
*/


/*
A sample page file:

navman.addpage('title', function () {
    this.style = document.createElement("style");
    this.style.innerHTML=`
    
    `;
    this.div = document.createElement("div");
    this.div.innerHTML = `
    
    `;
})
*/