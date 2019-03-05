// V3.1: added various retrieval methods, request filtering, and more!.

/*
You can use pwaExtract() to find a list of active scripts and links for caching.

Note: you need to include a manifest.json in your root directory as well. There's a sample manifest.json at the bottom of this file for you as well :) enjoy

Usage:
in index.html:
<script src="pwa.js"></script>
<script>
var pwaManager = new _pwaManager();
//that's literally it
</script>
*/

/*TODO:
this.tryTriggerPrompt();
*/

let serviceWorkerSettings = {
  urlsToCache: [
    "index.html",
    //You can get all the other URLs you want to cache by calling PWAExtract() from the console.
  ],
  CACHE_NAME: "version 5",
  RETRIEVAL_METHOD: "cacheReupdate" // cacheReupdate, networkOnly, cacheOnly
};

//Default functions (will be minified)
function waitDOMExecute(f) {
  if (document.readyState != "loading") f();
  else document.addEventListener("DOMContentLoaded", f);
}

function pwaExtract() {
  //Extract an array of all the scripts that you might want to cache
  let cacheURLs = [];
  let elements;
  elements = document.querySelectorAll("script");
  for (let i = 0; i < elements.length; i++) {
    cacheURLs.push(elements[i].src);
  }
  elements = document.querySelectorAll("link");
  for (let i = 0; i < elements.length; i++) {
    cacheURLs.push(elements[i].href);
  }
  return cacheURLs;
}

function _pwaManager(userSettings) {
  let me = this;
  this.settings = {
    serviceWorkerURL: "pwa.js", // This can just be this file! This file serves both functions for the price of one. Yeets!
    manifestURL: "manifest.json"
  };
  Object.assign(this.settings, userSettings);
  //NON-DOM initialisation
  this.deferredPrompt = undefined;
  window.addEventListener("beforeinstallprompt", e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    if (this.deferredPrompt == "autofire") {
      waitDOMExecute(() => {
        e.prompt();
      });
    } else {
      this.deferredPrompt = e;
    }
  });
  window.addEventListener("appinstalled", evt => {});

  this.firePrompt = function() {
    function tryFirePrompt() {
      if (me.deferredPrompt) {
        me.deferredPrompt.prompt();
      } else {
        me.deferredPrompt = "autofire";
      }
    }
    if (document.readyState != "loading") tryFirePrompt();
    else document.addEventListener("DOMContentLoaded", tryFirePrompt);
  };
  //DOM initalisation

  this._init = function() {
    if ("serviceWorker" in navigator) {
      let link = document.createElement("link");
      link.rel = "manifest";
      link.href = this.settings.manifestURL;
      document.head.appendChild(link);
      window.addEventListener("load", function() {
        navigator.serviceWorker.register(me.settings.serviceWorkerURL).then(
          function(registration) {
            // Registration was successful
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          function(err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
  };

  if (document.readyState != "loading") this._init();
  else document.addEventListener("DOMContentLoaded", () => this._init());
}

try {
  window.title = window.title;
} catch (err) {
  //Ok we are a service worker so act like one!!11
  self.addEventListener("install", function(event) {
    self.skipWaiting();
    // Perform install steps
    event.waitUntil(
      caches.open(serviceWorkerSettings.CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(serviceWorkerSettings.urlsToCache);
      })
    );
  });
  switch (serviceWorkerSettings.RETRIEVAL_METHOD) {
    case "cacheOnly":
      self.addEventListener("fetch", event => {
        //cache only speed test
        if (event.request.method == "GET") {
          event.respondWith(caches.match(event.request));
        }
      });
      break;
    case "cacheReupdate":
      let cache;
      async function setup() {
        cache = await caches.open(serviceWorkerSettings.CACHE_NAME);
      }
      setup();
      async function updateCache(event) {
        try {
          networkResponsePromise = fetch(event.request);
          const networkResponse = await networkResponsePromise;
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (e) {
          //network failure
        }
      }
      self.addEventListener("fetch", event => {
        if (event.request.method == "GET") {
          event.respondWith(
            (async function() {
              const cachedResponse = await cache.match(event.request, {
                ignoreSearch: true
              });
              // Returned the cached response if we have one, otherwise return the network response.
              if (cachedResponse && event.request.type!="cors") {
                //avoid CORS for things like firebase
                updateCache(event);
                return cachedResponse;
              } else return await updateCache(event);
            })()
          );
        } else {
          event.respondWith(fetch(event.request));
        }
      });
      break;
    case "networkOnly":
      self.addEventListener("fetch", (async function(event){
        //cache only speed test
        event.respondWith(await fetch(event.request));
      }));
      break;
  }
}
/*
A sample web app manifest for yuo! aswell!
{
  "short_name": "Maps",
  "name": "Google Maps",
  "icons": [
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/maps/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone",
  "scope": "/maps/",
  "theme_color": "#3367D6"
}
*/
