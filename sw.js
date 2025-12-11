const CACHE_NAME="app-cache-v1";
const ASSETS=["index.html","principal.html","style.css","app.js","principal.js","manifest.json"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(ASSETS)}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch",function(e){
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}));
});
self.addEventListener("message",function(e){});
