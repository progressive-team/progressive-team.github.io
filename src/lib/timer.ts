import { formatTime } from './utils/formatUtil';

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

  startTimer() {
    // 함수 안에 있는 이 아래 부분들은 전부 ui 로 관리되는 부분
    // 3페이지 타이머 UI 의 시작 버튼을 누를 경우 현재 timerDisplay 값으로 아래의 연산을 한 후 timer#start()의 인수에다가 넣어주면 됨.
    const timerString = this.timerDisplay.textContent;
    const duration = formatTime(timerString);
    this.settingGuide.dataset.cycleContext = `${this.currentCycle}/${this.totalCycle}`;
  }

  // ui 에서 클릭할 때 timer.changeState 해주기
  runByButton(keyword: string) {
    switch (keyword) {
      case 'work':
        this.changeState(State.WORK);
        break;
      case 'break':
        this.changeState(State.BREAK);
        break;
      case 'long-break':
        this.changeState(State.LONG_BREAK);
        break;
      default:
        throw new Error('Unknown button text');
    }
  }
}
