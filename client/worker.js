console.log('Service worker loaded...');

let count = 0;

self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('Push received...');

  self.clients
    .matchAll({
      includeUncontrolled: true,
      type: 'window',
    })
    .then(clients => {
      if (clients && clients.length) {
        // Send a response - the clients
        // array is ordered by last focused
        clients[0].postMessage({
          type: 'REPLY_COUNT',
          count: ++count,
        });
      }
    });

  self.registration.showNotification(data.title, {
    body: 'Notified by Me!',
  });
});
