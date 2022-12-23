console.log('serviceWorker.js loaded...');

self.importScripts('scripts/appData.js');
console.log('SW Version: ' + AD.version);

self.addEventListener("install", event => {
    console.log('SW.onInstall()');
    self.skipWaiting();
    event.waitUntil(
        caches.open(AD.cacheName).then(cache => {
            for (var i = 0; i < AD.appFiles.length; i++) {
                cache.delete(AD.appFiles[i]);
                cache.add(AD.appFiles[i]);
            }
        })
    )
});

self.addEventListener('activate', event => {
    console.log('SW.onActivate()');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('SW.onFetch(', event.request.url);
    event.respondWith((async() => {
        var reqPath = new URL(event.request.url).pathname;
        reqPath = reqPath.replace(/^\/?study\/|^\//gi, '');
        console.log('reqPath:', reqPath);
        if (AD.nonCacheFiles.includes(reqPath) || /epubs|\.epub/.test(reqPath)) {
            console.log('> Non-Caching From network:', event.request.url);
            response = await fetch(event.request)
                .catch(e => { console.log('SW.onFetch Error:', e); return; });
            return response;
        }

        var response = await caches.match(event.request);
        if (response) {
            console.log('+ From cache:', response.url);
            return response;
        }

        response = await fetch(event.request)
            .catch(e => {
                console.log('SW.onFetch Error:', e);
                var resObj = { "ok": false, "status": 500, "statusText": "Page not available" };
                return new Response('', resObj);
            });
        if (response && response.ok) {
            console.log('- From network:', response.url);
            if (!response.url.match(/\/api\//)) {
                console.log('> Caching:', response.url)
                var cache = await caches.open(AD.cacheName);
                cache.put(event.request, response.clone());
            }
        }
        return response;
    })());
});

self.addEventListener('message', event => {
    console.log('SW.onMessage(', event.request.url);
    var message = event.data;
    console.log('message.type: ', message.type);
    // do stuff for different message types...
});

self.addEventListener('sync', event => {
    console.log('SW.onSync() not implemented yet', event.id);
    // if (event.id == 'updateQuestions') {
    //     event.waitUntil(
    //         caches.open(AD.cacheName).then(cache => {
    //             return cache.add('questions.json');
    //         })
    //     )
    // }
});