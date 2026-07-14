// EMERGENCY KILL SWITCH — not wired into the app, deploy manually only.
//
// If a bad service worker is stuck on clients and needs to be removed for
// everyone immediately: copy this file's contents over the built /sw.js
// (or over public/sw.js before a build, if sw.js is otherwise generated)
// and deploy. Every client that still has an old worker installed will
// pick this one up on its next update check, which unregisters itself,
// clears all caches, and forces open tabs back to the network.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});