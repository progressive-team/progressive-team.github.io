import Timer from '../lib/models/Timer.svelte';
let timer: Timer | null = $state(null);

export const timerStore = {
  set value(newTimer: Timer) {
    timer = newTimer;
  },
  get value(): Timer | null {
    return timer;
  },
};
