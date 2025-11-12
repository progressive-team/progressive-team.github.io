export default class Timer {
  changeState(state: TimerInfo) {
    // 이 밑은 전부 UI 부
    this.setTimerDisplay() = this.getTime(state);
    for (const tab of this.tabs) {
      tab.ariaSelected =
        tab.dataset.keyword === state.keyword ? 'true' : 'false';
    }
  }
  initTimer() {
    // todo notify 알림하는 걸 설정에서 스스로 켜게 하기? 타이머 버튼 옆에서 켜게 하기? => 왜 이걸 생각하냐면 notify 하는 것 자체는 타이머가 가질 역할이 아니고 홀로 독립되어 동작할 수 있기 때문임. (다른 버튼으로 역할 위임)
    // requestNotificationPermission();;
  }
}
