export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function showNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('알림', { body: message });
  }
}
