/*
scriptAssert V2.1: Load multiple scripts, links etc in a chain, to preserve dependencies; but also prevent redundant loading.
Now with CSS loading!



How to use:

scriptassert([[module_name, path_to_script, path_to_css]], function_to_execute)

list: list of pairs:
[[module name,path to script]]
done: some function.

For consistency, the module name should be in all lowercase and not include the extension name e.g. fullCalendar.js should be just fullcalendar.
*/

var __assert_states = {};
function scriptassert(list, done, sroot) {//shadow root option
    let _list = [];
    if (list.length == undefined) {
        for (i in list) {
            _list.push([i, list[i].p, list[i].s]);
        }
        list = _list;
    }
    if (list.length) {
        let varname = list[0][0];
        let path = list[0][1];
        let csspath = list[0][2];
        list.splice(0, 1);
        if (!__assert_states[varname]) {
            //first check if the script already exists in the document.
            let scripts = document.querySelectorAll("script");
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].src == path) {
                    //ok we done here
                    __assert_states[varname] = { state: 'done' };
                    //add the css to the root anyways?
                    done();
                }
            }
            __assert_states[varname] = { state: 'loading' };
            __assert_states[varname].callbacks = [];
            __assert_states[varname].callbacks.push(() => { scriptassert(list, done) });
            //append script to root
            //wait until script is done loading?
            // if there is a css file load that as well.
            if (csspath) {
                let l = document.createElement("link");
                l.href = csspath;
                l.rel = "stylesheet";
                l.type = "text/css";
                document.head.appendChild(l);
            }

            let s = document.createElement("script");
            document.head.appendChild(s);
            s.onload = function () {
                __assert_states[varname].state = 'done';
                for (var i = 0; i < __assert_states[varname].callbacks.length; i++) {
                    __assert_states[varname].callbacks[i]();
                    //console.log("done");
                }
            }
            try{s.src = path;
            }catch(e){
                console.log(e);
                __assert_states[varname].state='failed'
                for (var i = 0; i < __assert_states[varname].callbacks.length; i++) {
                    __assert_states[varname].callbacks[i]();
                    //console.log("done");
                }
            }
            //while(waiting);
            //console.log("started...");
        } else if (__assert_states[varname].state == 'loading') {
            __assert_states[varname].callbacks.push(() => { scriptassert(list, done) });
            //console.log("skipped, waiting");
        } else {
            //console.log("skipped, ready");
            scriptassert(list, done)
        }
    } else if (done) done();
}