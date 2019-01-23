function bindDOM(base, el, varname) {
    //TODO: compensate for existing getters and setters; compensate for existing value.

    if (el.tagName.toLowerCase() == "input") {
        Object.defineProperty(base, varname, {
            get: () => {
                return el.value;
            },
            set: (value) => {
                el.value = value;
            }
        })
    } else {
        Object.defineProperty(base, varname, {
            get: () => {
                return el.innerText;
            },
            set: (value) => {
                el.innerText = value;
            }
        })
    }
}


function guid() {
    let pool = "1234567890qwertyuiopasdfghjklzxcvbnm";
    tguid = "";
    for (i = 0; i < 4; i++) tguid += pool[Math.floor(Math.random() * pool.length)];
    return tguid;
}