import Timer from '../lib/models/Timer';
export const timers: Timer[] = $state([]);
export const mainTimer: Timer = $derived(timers[0]);
