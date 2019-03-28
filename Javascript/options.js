//v0.1 Options.js. Shorthand for creating inputs and buttons on divs that relate to properties.

function _option(settings){
    let appendedElement;
    switch (settings.type){
        case "bool":
            appendedElement=document.createElement("input");
            appendedElement.type="checkbox";
            appendedElement.addEventListener("input",()=>{
                settings[object][settings[property]]=appendedElement.value;
            })
    }
    if (settings.label){
        let lb=document.createElement("label");
        lb.innerHTML=settings.label;
        lb.appendChild(appendedElement);
        settings.div.appendChild(lb)
    }else{
        settings.div.appendChild(appendedElement);
    }
    
}