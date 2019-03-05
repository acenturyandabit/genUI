//verify that I am actually mobile
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.addEventListener("DOMContentLoaded", function () {
        var metaTag = document.createElement("meta");
        metaTag.name = "viewport";
        metaTag.content = "width=device-width, initial-scale=1";
        document.head.appendChild(metaTag);
        //CSS for stuff
        var cssTag = document.createElement("style");
        cssTag.innerHTML = `input, button{
            width:100%;
        }`;
        document.head.appendChild(cssTag);
    })
}

function isPhone(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerHeight > window.innerWidth) {
        return true;
    }
}