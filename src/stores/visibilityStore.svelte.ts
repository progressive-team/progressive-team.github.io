type Visibility = 'create' | 'setting' | 'active';

let visibility = $state<Visibility>('create');
let previousVisibility: Visibility | null = null;

export function currentPage() {
  return visibility;
}

export function showSettingModal() {
  previousVisibility = visibility;
  visibility = 'setting';
}

export function showTimerCreateArea() {
  visibility = 'create';
}

export function showTimerActiveArea() {
  visibility = 'active';
}

export function goBack() {
  if (previousVisibility) {
    visibility = previousVisibility;
    previousVisibility = null;
  }
}
