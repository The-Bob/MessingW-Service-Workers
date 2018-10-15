function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {scope: '/'})
  .then(function(registration) {
    console.log('Registered!', registration);
    swReg = registration;
    console.log(swReg);
    initializeUI();
  }, err => console.error('failed :('));

  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker Ready');
  });
  if ('PushManager' in window) {
    const PUBLIC_KEY = "BJe5RUpkD4srh_25eKEM9cOBXRhVM7DnNucb1yj-pCNyuR1UG8djrGW4H7SnUbtVo7g7UdQt5SqjIAyBN6j3K_8";
    var pushButton = document.getElementById("subButton");

    function initializeUI() {
      pushButton.addEventListener('click', () => {
        pushButton.disabled = true;

        if (isSubscribed) {
          // TODO: Unsubscribe user
        } else {
          subscribeUser();
        }
      });

      swReg.pushManager.getSubscription()
        .then(subscription => {
          isSubscribed = !(subscription === null);

          updateSubscriptionOnServer(subscription);

          console.log(`User ${isSubscribed ? "IS" : "is Not"} subscribed.`);

          updateBtn();

        })
    }

    function updateBtn(){
      if(isSubscribed){
        pushButton.textContent = 'Disable Push Messaging';
      } else {
        pushButton.textContent = 'Enable Push Messaging';
      }
      pushButton.disabled = false;

    }

    Notification.requestPermission(status =>{
      console.log('Notification permission status: ', status);
    })

    function subscribeUser() {
      const APPLICATION_SERVER_KEY = urlB64ToUint8Array(PUBLIC_KEY);

      swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: APPLICATION_SERVER_KEY
      })
        .then((subscription) => {
          console.log('User is subscribed');

          updateSubscriptionOnServer(subscription);

          isSubscribed = true;

          updateBtn();
        }, err => {
          console.log('failed to subscribe user', err);

          updateBtn();
        });
    }

    function updateSubscriptionOnServer(subscription) {
      // TODO: Send subscription to application server

      const subscriptionJson = document.querySelector('.js-subscription-json');
      const subscriptionDetails =
        document.querySelector('.js-subscription-details');

      if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
      } else {
        subscriptionDetails.classList.add('is-invisible');
      }
    }
  }

}
