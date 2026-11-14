// Keeps a copy of the editor page in the browser, so the page also opens without internet.
// With internet the newest page is always used; the saved copy is only for when there is none.
const CACHE = "mezmur-editor-1";

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.add("./"); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;   // only the page itself
  event.respondWith(
    fetch(event.request).then(function (reply) {
      if (reply.ok) {
        const copy = reply.clone();
        caches.open(CACHE).then(function (cache) { cache.put("./", copy); });
      }
      return reply;
    }).catch(function () { return caches.match("./"); })
  );
});
