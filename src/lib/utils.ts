export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function showNotification(message: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('알림', { body: message });
  }
}

export const getDisplayFormat = (minutes: number, seconds: number) =>
  `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

function formatTimeString(value: string) {
  let val = value.replace(/\D/g, '');
  if (!val) {
    return '00:00';
  }

  let seconds = parseInt(val.slice(-2)) || 0;
  let minutes = parseInt(val.slice(0, -2)) || 0;

  if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
  }

  return getDisplayFormat(minutes, seconds);
}

export function formatTimeInput(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = formatTimeString(input.value);
}
