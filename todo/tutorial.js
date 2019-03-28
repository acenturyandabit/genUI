//v0.2. 

/*
How to use:
- Instantiate: 
var t = new _tutorial({
    root: rootElement,
    indicateRemaining: true // whether or not to list the number of steps remaining
    shader: true, // whether or not to apply a shader div over the rest of the document.
});

- Push steps:
var id=t.push({
    id: 'uniqueID' (optional),
    el: element,
    text: 'hello world!',
    to: 'nextID', OR
    to: [{button:'buttonText',id:'uniqueID'},{button:'buttonText',id:'uniqueID'}],
    location: 'above' OR 'below' OR 'left' OR 'right',
    arrowCentering: 'center' OR 'start' OR 'end'
})

- Run the tutorial!
t.start(uuid);

*/

function _tutorial(options){
    this.guid=function(count = 6) {
        let pool = "1234567890qwertyuiopasdfghjklzxcvbnm";
        tguid = "";
        for (i = 0; i < count; i++) tguid += pool[Math.floor(Math.random() * pool.length)];
        return tguid;
    }
    this.items={};
    this.
    this.push=function(item){
        //if no id then generate a uuid? 
        if (!item.id){
            item.id=this.guid();
        }
        this.items[item.id]=item;
        return item.id
    }
    this.start=function(id){

    }
}









// V0.1. Still dependent heavily on jquery (soz)... Will attempt to download jQuery from CDN if it does not have access to jQuery. At least there's that.
//With JQinit V2.2 to fill said dependency.

//on hold. using intro.js for now.


//mutation observer to listen for things which are ".dialog".

tutorialManager = {
    steps:[
        {
            type:"overlay",
            position:["30vw",'30vh'],
            //focusElement:()=>{return $(".synergist")[0]},
            prompt:"Welcome to Synergist!",
        }


    ],

    //not yet implemented
    //Set to true if you want the tutorial to automatically play. Alternatively, put your own condition in the function!
    autoplayIf: ()=>{
        return false;
    },







    //////////////////Down here there isn't really much for you to change, unless you're particularly annoyed at sth.//////////////////

    showStep:function(step){
        //load this step
        let thisStep=this.steps[step];
        //clear the previous step
        $("tutorial").empty();
        //load this step
        switch (thisStep.type){
            case "overlay":
                $("tutorial").append(`<div class="tutorialShader"></div>`);
                $("tutorial").append()
                //Apply little shader.
                //put text in box at coords.

        }
    },

    play: function(){
        this.showStep(0);
    },

    init: function(){
        //add a tutorial div to the body.
        $("body").append(`<div class="tutorial"></div>`);
        //add styling
        $("head").append(`<style>
        .tutorialShader{

        }
        
        
        </style>`);
    }
}




// JQInit 2.2. Now nice and fancy and supports multiple instances of JQinit!
try{
    if (JQInit.run){console.log("Readying JQ...")};
}catch (e){
    JQInit={
        run:false,
        fWhenReady:[],
        start:function(_f){
            if (this.run){// If I have already been run...
                if (this.jQueryReady){
                    $(_f);
                }else{
                    this.fWhenReady.push(_f);
                }
            }else{
                this.run=true;
                if (jQuery){
                    this.jQueryReady=true;
                    $(_f);
                }else{
                    let scr = document.createElement("script");
                    scr.src = src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
                    scr.addEventListener("load", () => {
                        JQInit.fWhenReady.forEach((v,i)=>{$(_f)});
                    });
                }
            }
        }
    }
}