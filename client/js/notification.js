// ===== Browser Push Notifications =====

const initNotifications = async () => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
  }

  if (Notification.permission !== 'granted') return;

  // Subscribe to push if service worker available
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      const subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        // Get VAPID key from server
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
          });
          // For now, just use browser notifications via socket
        } catch (e) {}
      }
    } catch (err) {
      console.log('Service worker registration skipped');
    }
  }
};

const showBrowserNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/assets/logo.png',
      badge: '/assets/logo.png'
    });
  }
};
