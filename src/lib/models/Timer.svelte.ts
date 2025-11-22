import {
  formatTimeInput,
  formatTime,
  getDisplayFormat,
} from '../utils/formatUtil';

export type TimerState = 'work' | 'break' | 'long-break';

// todo 근본적으로 timer 컴포넌트마다 id 가 부여되어서 인지하고 있어야 함.
// 그래야 timerStore.ts 의 timers 목록에서 꺼내 옴.
export default class Timer {
  runState: boolean;
  worker: Worker;
  timerState: TimerState;
  timerDisplay: string;

  workTime: string;
  breakTime: string;
  longBreakTime: string;
  totalCycle: number;
  currentCycle: number;
  isToggle: boolean;

  constructor() {
    this.runState = $state(false);
    this.worker = new Worker(new URL('./Worker.ts', import.meta.url), {
      type: 'module',
    });
    this.timerState = $state('work');
    this.timerDisplay = $state('');

    this.workTime = $state('25:00');
    this.breakTime = $state('05:00');
    this.longBreakTime = $state('15:00');
    this.totalCycle = $state(1);
    this.currentCycle = $state(1);
    this.isToggle = $state(false);

    this.worker.onmessage = (event) => {
      const remaining = event.data.remaining;

      const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      // 시간 반영 부분
      this.timerDisplay = getDisplayFormat(minutes, seconds);

      // 남은 시간이 0보다 크면 타이머 종료 동작하지 않기
      if (remaining > 0) return;
      this.skipNextPhase();
    };
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

    this.timerDisplay = this.getTimeByState();
  }

  isRunning(): boolean {
    return this.runState;
  }

  stop() {
    this.worker.postMessage({ command: 'stop' });
    this.runState = false;
  }

  reset() {
    this.stop();
    this.currentCycle = this.totalCycle; // 주기 초기화
    if (this.isToggle && this.timerState !== 'long-break') {
      let value = Number(this.workTime.replace(/\D/g, '')) - 500;
      if (value < 0) value = 0;
      this.workTime = formatTimeInput(String(value));
    }
    this.changeState('work');
  }

  start() {
    const duration = formatTime(this.getTimeByState());
    this.worker.postMessage({ command: 'start', duration: duration });
    this.runState = true;
  }

  changeState(state: TimerState) {
    this.timerState = state;
    this.timerDisplay = this.getTimeByState();
  }

  getTimeByState(): string {
    switch (this.timerState) {
      case 'work':
        return this.workTime;
      case 'break':
        return this.breakTime;
      case 'long-break':
        return this.longBreakTime;
    }
  }

  skipNextPhase() {
    this.stop();
    switch (this.timerState) {
      case 'work':
        this.changeState('break');
        // todo 이거 여기서 처리?
        // 그리고 현재 주기 표시할 때 전체 주기도 표시해주기
        // showNotification(`짧은 휴식 시작. 현재 주기: ${this.currentCycle}`);
        this.start();
        break;
      case 'break':
        if (this.currentCycle > 1) {
          this.changeState('work');
          this.currentCycle--;
        } else {
          this.changeState('long-break');
          if (this.isToggle) {
            this.workTime = formatTimeInput(
              String(Number(this.workTime.replace(/\D/g, '')) + 500),
            ); // 5분 증가
          }
          // showNotification('모든 주기 종료\n긴 휴식 시작');
        }
        this.start();
        break;
      case 'long-break':
        this.currentCycle = this.totalCycle; // 주기 초기화
        this.changeState('work');
        // showNotification('뽀모도로 종료');
        break;
      default:
        throw new Error('Unknown State');
    }
  }
}
