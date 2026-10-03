const C='lsp-v8';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./app.js','./data/science-methods.js','./manifest.json','./data/calculators.js','./data/buffers.js','./data/bio-science.js','./data/reference-registry.json','./docs/SCIENTIFIC_BOUNDARIES.md']))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
