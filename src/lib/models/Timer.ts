import { formatTime } from '../utils/formatUtil';

type TimerState = 'work' | 'break' | 'long-break';

// todo 근본적으로 timer 컴포넌트마다 id 가 부여되어서 인지하고 있어야 함.
// 그래야 timerStore.ts 의 timers 목록에서 꺼내 옴.
export default class Timer {
  runState: boolean;

  timerState: TimerState;
  workTime: string;
  breakTime: string;
  longBreakTime: string;
  totalCycle: number;
  currentCycle: number;

  constructor() {
    this.runState = false;

    this.timerState = 'work';
    this.workTime = '25:00';
    this.breakTime = '05:00';
    this.longBreakTime = '15:00';
    this.totalCycle = 1;
    this.currentCycle = 1;
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

  isRunning(): boolean {
    return this.runState;
  }

  init() {
    this.currentCycle = this.totalCycle;
  }
}
