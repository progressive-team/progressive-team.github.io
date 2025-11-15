let timer = null;
let remainingTime = 0;

self.onmessage = function (e) {
  const { command, time } = e.data;

  switch (command) {
    case 'start':
      if (timer) clearInterval(timer);
      remainingTime = time;
      timer = setInterval(() => {
        remainingTime -= 1000;
        self.postMessage({ remainingTime });
        if (remainingTime <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, 1000);
      break;
    case 'stop':
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      break;
    case 'reset':
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      remainingTime = time;
      self.postMessage({ remainingTime });
      break;
  }
};
