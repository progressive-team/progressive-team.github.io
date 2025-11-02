import { requestNotificationPermission, showNotification } from './notify.js';

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

class TimerInfo {
  constructor(name, keyword) {
    this.name = name;
    this.keyword = keyword;
  }
}

export const State = Object.freeze({
  WORK: new TimerInfo('일할 시간', 'work'),
  BREAK: new TimerInfo('짧은 휴식', 'break'),
  LONG_BREAK: new TimerInfo('긴 휴식', 'long-break'),
});

export default class Timer {
  constructor(mainApp, timerDisplay, tabButtons, settingGuide, worker) {
    this.mainApp = mainApp;
    this.timerDisplay = timerDisplay;
    this.tabButtons = tabButtons;
    this.settingGuide = settingGuide;
    this.worker = worker;

    this.workTime = '25:00';
    this.breakTime = '05:00';
    this.longBreakTime = '15:00';
    this.totalCycle = 1;
    this.currentCycle = 1;
  }

  changeState(state) {
    this.mainApp.dataset.state = state.keyword;
    this.timerDisplay.textContent = this.getTime(state);
    for (const button of this.tabButtons) {
      if (button.textContent === state.name) {
        button.classList.add('active');
        continue;
      }
      button.classList.remove('active');
    }
  }

  getTime(state) {
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
    // work가 아닐 때 work 상태로 변경
    if (this.mainApp.dataset.state !== 'work') {
      this.changeState(State.WORK);
    }
  }

  startTimer() {
    requestNotificationPermission();

    // 주기 초기화
    this.currentCycle = this.totalCycle;

    const timerString = timerDisplay.textContent;
    const parts = timerString.split(':');
    const duration = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;

    this.worker.postMessage({ command: 'start', duration: duration });

    this.mainApp.dataset.timerState = 'running';
    this.settingGuide.dataset.cycleContext = `${this.currentCycle}/${this.totalCycle}`;
  }

  skipNextPhase() {
    this.stopTimer();

    const state = this.mainApp.dataset;
    let autoStart = false;

    switch (state) {
      case 'work':
        this.changeState(State.BREAK);
        showNotification('짧은 휴식 시작!');
        autoStart = true;
        break;

      case 'break':
        if (this.currentCycle > 1) {
          this.changeState(State.WORK);
          this.currentCycle--;
        } else {
          this.changeState(State.LONG_BREAK);
          showNotification('모든 주기 종료\n긴 휴식 시작!');
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

  setTime(workTime, breakTime, longBreakTime, cycle) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.longBreakTime = longBreakTime;
    this.totalCycle = cycle;
    this.currentCycle = cycle;
  }

  runByButton(buttonText) {
    switch (buttonText) {
      case '일할 시간':
        this.changeState(State.WORK);
        break;
      case '짧은 휴식':
        this.changeState(State.BREAK);
        break;
      case '긴 휴식':
        this.changeState(State.LONG_BREAK);
        break;
      default:
        throw new Error('Unknown button text');
    }
  }

  setTimerDisplay(value) {
      this.timerDisplay.textContent = value;
  }
}
