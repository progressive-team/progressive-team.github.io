let timerId = null;
let totalDuration = 0;
let startTime = 0;

function tick() {
  const elapsed = Date.now() - startTime;
  const remaining = totalDuration - elapsed;

  if (remaining <= 0) {
    postMessage({ type: 'end' });
    clearTimeout(timerId);
    timerId = null;
  } else {
    postMessage({ type: 'tick', remaining: remaining });

    timerId = setTimeout(tick, 100);
  }
}

self.onmessage = (event) => {
  const { command, duration } = event.data;

  if (command === 'start') {
    if (timerId) {
      clearTimeout(timerId);
    }

    totalDuration = duration;
    startTime = Date.now();
    tick(); // 타이머 시작
  } else if (command === 'stop') {
    clearTimeout(timerId);
    timerId = null;
  }
};
