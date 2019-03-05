//Templateify!


function _vocoder(settings) {
    let me = this;
    this.settings = Object.assign({
        interimResults: true,
        maxAlternatives: 10,
        continuous: true,
    }, settings);
    addEventAPI(this);



    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let recognition = new window.SpeechRecognition();
    recognition.interimResults = this.settings.interimResults;
    recognition.maxAlternatives = this.settings.maxAlternatives;
    recognition.continuous = this.settings.continuous;

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                me.fire("final", transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        me.fire('interim', interimTranscript);
    }
    recognition.start();
    recognition.onend = () => {
        recognition.start();  
    }
}

function addEventAPI(itm) {
    itm.events = {},
        itm.fire = function (e, args) {
            if (itm.events[e]) {
                itm.events[e].forEach((f, i) => {
                    try {
                        f(args)
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }
    itm.on = function (e, f) {
        _e = e.split(',');
        _e.forEach((i) => {
            if (!itm.events[i]) itm.events[e] = [];
            itm.events[i].push(f);
        })

    }
}