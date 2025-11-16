import { timerStore } from "./timerStore.svelte";
const {value: timer} = timerStore;
type Visibility = 'create' | 'setting' | 'active';


let visibility = $state<Visibility>('create');

export function currentPage() {
  return visibility;
}

export function showSettingModal() {
  visibility = 'setting';
}

export function showTimerCreateArea() {
  visibility = 'create';
}

export function showTimerActiveArea() {
  visibility = 'active';
}
