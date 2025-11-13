import Timer from '../lib/models/Timer';
let timer: Timer | null = $state(null);

export const timerStore = {
  set value(newTimer: Timer) {
    timer = newTimer;
  },
  get value(): Timer | null {
    return timer;
  },
};
