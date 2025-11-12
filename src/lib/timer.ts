import { requestNotificationPermission, showNotification } from './notify.js';

class TimerInfo {
  name: string;
  keyword: string;

  constructor(name: string, keyword: string) {
    this.name = name;
    this.keyword = keyword;
  }
}

export const State = {
  WORK: new TimerInfo('일할 시간', 'work'),
  BREAK: new TimerInfo('짧은 휴식', 'break'),
  LONG_BREAK: new TimerInfo('긴 휴식', 'long-break'),
} as const;

export default class Timer {
  mainApp: HTMLElement;
  timerDisplay: HTMLElement;
  tabs: NodeListOf<HTMLElement>;
  settingGuide: HTMLElement;
  worker: Worker;

  workTime: string;
  breakTime: string;
  longBreakTime: string;
  totalCycle: number;
  currentCycle: number;

  constructor(
    mainApp: HTMLElement,
    timerDisplay: HTMLElement,
    tabs: NodeListOf<HTMLElement>,
    settingGuide: HTMLElement,
    worker: Worker,
  ) {
    this.mainApp = mainApp;
    this.timerDisplay = timerDisplay;
    this.tabs = tabs;
    this.settingGuide = settingGuide;
    this.worker = worker;

    this.workTime = '25:00';
    this.breakTime = '05:00';
    this.longBreakTime = '15:00';
    this.totalCycle = 1;
    this.currentCycle = 1;
  }

  changeState(state: TimerInfo) {
    this.mainApp.dataset.state = state.keyword;
    this.timerDisplay.textContent = this.getTime(state);
    for (const tab of this.tabs) {
      tab.ariaSelected =
        tab.dataset.keyword === state.keyword ? 'true' : 'false';
    }
  }

  getTime(state: TimerInfo) {
    switch (state) {
      case State.WORK:
        return this.workTime;
      case State.BREAK:
        return this.breakTime;
      case State.LONG_BREAK:
        return this.longBreakTime;
      default:
        throw new Error('Unknown state');
    }
  }

  isTimerRunning() {
    return this.mainApp.dataset.timerState === 'running';
  }

  stopTimer() {
    this.worker.postMessage({ command: 'stop' });
    this.mainApp.dataset.timerState = 'stopped';
  }

  resetTimer() {
    this.stopTimer();
    this.currentCycle = this.totalCycle;
    this.changeState(State.WORK);
  }

  initTimer() {
    requestNotificationPermission();

    // 주기 초기화
    this.currentCycle = this.totalCycle;
  }

  startTimer() {
    const timerString = this.timerDisplay.textContent;
    const parts = timerString.split(':');
    const duration = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;

    this.worker.postMessage({ command: 'start', duration: duration });

    this.mainApp.dataset.timerState = 'running';
    this.settingGuide.dataset.cycleContext = `${this.currentCycle}/${this.totalCycle}`;
  }

  skipNextPhase() {
    this.stopTimer();

    const { state } = this.mainApp.dataset;
    let autoStart = false;

    switch (state) {
      case 'work':
        this.changeState(State.BREAK);
        showNotification(
          `짧은 휴식 시작. 현재 주기: ${this.settingGuide.dataset.cycleContext}`,
        );
        autoStart = true;
        break;

      case 'break':
        if (this.currentCycle > 1) {
          this.changeState(State.WORK);
          this.currentCycle--;
        } else {
          this.changeState(State.LONG_BREAK);
          showNotification('모든 주기 종료\n긴 휴식 시작');
        }
        autoStart = true;
        break;

      case 'long-break':
        this.changeState(State.WORK);
        showNotification('뽀모도로 종료');
        break;
      default:
        throw new Error('Unknown state');
    }

    if (autoStart) this.startTimer();
  }

  setTime(
    workTime: string,
    breakTime: string,
    longBreakTime: string,
    cycle: number,
  ) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.longBreakTime = longBreakTime;
    this.totalCycle = cycle;
    this.currentCycle = cycle;
  }

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

  setTimerDisplay(value: string) {
    this.timerDisplay.textContent = value;
  }
}
