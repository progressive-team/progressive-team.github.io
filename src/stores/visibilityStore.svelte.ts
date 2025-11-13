export const visibility = $state({
    timerCreateArea: false,
    settingModal: false,
    timerActiveArea: false,
  });

export function hideSettingModal() {
    visibility.settingModal = false;
  }

export function showSettingModal() {
    visibility.settingModal = true;
  }

export function hideTimerCreateArea() {
    visibility.timerCreateArea = false;
  }

export function showTimerActiveArea() {
    visibility.timerActiveArea = true;
  }