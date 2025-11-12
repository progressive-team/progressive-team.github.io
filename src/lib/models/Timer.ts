import { formatTime } from '../utils/formatUtil';

type TimerState = 'work' | 'break' | 'long-break';

// todo 근본적으로 timer 컴포넌트마다 id 가 부여되어서 인지하고 있어야 함.
// 그래야 timerStore.ts 의 timers 목록에서 꺼내 옴.
export default class Timer {
  runState: boolean;
  worker: Worker;
  timerState: TimerState;
  workTime: string;
  breakTime: string;
  longBreakTime: string;
  totalCycle: number;
  currentCycle: number;

  constructor() {
    this.runState = false;
    this.worker = new Worker(new URL('./Worker.ts', import.meta.url), {
      type: 'module',
    });
    this.timerState = 'work';
    this.workTime = '25:00';
    this.breakTime = '05:00';
    this.longBreakTime = '15:00';
    this.totalCycle = 1;
    this.currentCycle = 1;

    this.worker.onmessage = (event) => {
      const remaining = event.data.remaining;

      const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      // todo 이거 ui 에서 잡으면 좋을 것 같은데 worker 의 핵심부 못 빼내나?
      // const formatted = getDisplayFormat(minutes, seconds);
      // setTimerDisplay(formatted);

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
  }

  isRunning(): boolean {
    return this.runState;
  }

  init() {
    this.currentCycle = this.totalCycle;
  }
}
