const CACHE_NAME = 'serralheria-app-v1';
// Cacheamos todos os arquivos estáticos e CDNs essenciais.
const urlsToCache = [
    './index.html',
    './manifest.json',
    // Assets Estáticos e Bibliotecas
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js',
    // Dependências do Firebase (Versão 11.6.1)
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cached essential files for offline use.');
                return cache.addAll(urlsToCache).catch((error) => {
                    console.warn('Service Worker: Failed to cache some external URLs:', error);
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Cache-First strategy for cached resources, Network-Only for others.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Try network
                return fetch(event.request).catch(() => {
                    // Se falhar, retorna a página principal para navegação
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
