// V0.1

/*TODO:
superAutoInstaller?
Add default minified functions
*/

function _thing(userSettings) {
    let me = this;
    this.settings = {
        
    }
    Object.assign(this.settings, userSettings);
    //NON-DOM initialisation
    
    //DOM initalisation
    
    this._init = function () {
        
    };

    if (document.readyState != "loading") this._init();
    else document.addEventListener("DOMContentLoaded", () => this._init());

}