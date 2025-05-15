export const unregisterServiceWorker = async () => {
  try {
    // Limpar service workers
    const registrations = await navigator.serviceWorker?.getRegistrations();
    await Promise.all(registrations?.map(registration => registration.unregister()) || []);

    // Limpar caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));

    // Limpar cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Forçar limpeza usando Clear-Site-Data
    document.cookie = 'Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"';

    // Fazer uma nova requisição sem cache
    await fetch(window.location.href, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Recarregar a página
    window.localStorage.setItem('reload', 'true');
    window.location.reload();
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};