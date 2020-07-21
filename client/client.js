const publicVapidKey =
  'BPjWPPAB07Y5XkNzHW8E99sqoKRDA5N7BeMwi8yqGHgzapZuFBWt14KLxXa0IUGR3cNkEnFKX-goJ11WsjevPqA';

// Check for service worker
if ('serviceWorker' in navigator) {
  send().catch(err => console.error(err));

  navigator.serviceWorker.addEventListener('message', event => {
    const { type, count } = event.data;

    if (type === 'REPLY_COUNT') {
      document.title = document.hidden && `(${count}) Novas mensagens`;
    }
  });
}

document.addEventListener('visibilitychange', function () {
  document.title = 'Push notification';
});

// Register sw, Register Push, Send Push
function send() {
  return navigator.serviceWorker
    .register('/worker.js', {
      scope: '/',
    })
    .then(registration => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(subscription => {
      return fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'content-type': 'application/json',
        },
      });
    })
    .then(() => console.log('Push sent...'));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
