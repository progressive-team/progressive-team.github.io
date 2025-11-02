import 'normalize.css';
import '@noonnu/bmjua';

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

const State = Object.freeze({
  WORK: new TimerInfo('일할 시간', 'work'),
  BREAK: new TimerInfo('짧은 휴식', 'break'),
  LONG_BREAK: new TimerInfo('긴 휴식', 'long-break'),
});

class Timer {
  constructor() {
    this.workTime = '25:00';
    this.breakTime = '05:00';
    this.longBreakTime = '15:00';
    this.totalCycle = 1;
    this.currentCycle = 1;
  }

  changeState(state) {
    mainApp.dataset.state = state.keyword;
    timerDisplay.textContent = this.getTime(state);
    tabButton.forEach((button) => {
      if (button.textContent === state.name) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  getTime(state) {
    if (state === State.WORK) {
      return this.workTime;
    } else if (state === State.BREAK) {
      return this.breakTime;
    } else if (state === State.LONG_BREAK) {
      return this.longBreakTime;
    }
  }

  isTimerRunning() {
    return mainApp.dataset.timerState === 'running';
  }

  stopTimer() {
    worker.postMessage({ command: 'stop' });
    mainApp.dataset.timerState = 'stopped';
  }

  resetTimer() {
    this.stopTimer();

    timer.currentCycle = timer.totalCycle;
    // work가 아닐 때 work 상태로 변경
    if (mainApp.dataset.state !== 'work') {
      mainApp.dataset.state = 'work';
      tabButton.forEach((button) => {
        if (button.textContent === '일할 시간') {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
    timerDisplay.textContent = timer.workTime;
  }

  startTimer() {
    requestNotificationPermission();

    const timerString = timerDisplay.textContent;
    const parts = timerString.split(':');
    const duration = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;

    worker.postMessage({ command: 'start', duration: duration });

    mainApp.dataset.timerState = 'running';
    settingGuide.dataset.cycleContext = `${timer.currentCycle}/${timer.totalCycle}`;
  }
  setTime(workTime, breakTime, longBreakTime, cycle) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.longBreakTime = longBreakTime;
    this.totalCycle = cycle;
    this.currentCycle = cycle;
  }
}

const timer = new Timer();

const mainApp = document.querySelector('main.app');

const settingModal = document.querySelector('.timer-setting-modal');

const createButton = document.querySelector('#create-timer');
createButton.addEventListener('click', () => {
  settingModal.hidden = false;
});

const closeButton = document.querySelector('button[aria-label="닫기"]');
closeButton.addEventListener('click', () => {
  settingModal.hidden = true;
});

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const longBreakTimeInput = document.getElementById('long-break-time');
const cycleInput = document.getElementById('cycle');
workTimeInput.value = timer.workTime;
breakTimeInput.value = timer.breakTime;
longBreakTimeInput.value = timer.longBreakTime;
cycleInput.value = timer.totalCycle;

const timeInputs = document.querySelectorAll(
  '#work-time, #break-time, #cycle, #long-break-time'
);

timeInputs.forEach((input) => {
  input.addEventListener('blur', () => {
    if (input.id !== 'cycle') formatTimeInput(input); //주기를 제외하고 타이머 값 포맷팅
  });
});

const tabButton = document.querySelectorAll('.tab-button');
tabButton.forEach((button) => {
  button.addEventListener('click', () => {
    // 이미 선택되어 있는 상태에서는 다시 선택 로직이 동작하지 않게끔 하기
    if (button.classList.contains('active')) return;

    detachActiveClass(); // todo 로직 제거
    button.classList.add('active');

    const buttonText = button.textContent;
    if (buttonText === '일할 시간') {
      timer.changeState(State.WORK);
    } else if (buttonText === '짧은 휴식') {
      timer.changeState(State.BREAK);
    } else if (buttonText === '긴 휴식') {
      timer.changeState(State.LONG_BREAK);
    }

    if (timer.isTimerRunning()) {
      timer.stopTimer();
    }
  });
});

const timerDisplay = document.querySelector('.timer-display');

//만들기 버튼 클릭 시 검증 로직
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', verify);

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  if (timer.isTimerRunning()) {
    timer.resetTimer();
  } else {
    timer.currentCycle = timer.totalCycle;
    timer.startTimer();
  }
});

const settingGuide = document.querySelector('.setting-guide');
settingGuide.addEventListener('click', () => {
  if (!timer.isTimerRunning()) {
    openSettingModal();
  }
});

function detachActiveClass() {
  tabButton.forEach((button) => {
    button.classList.remove('active');
  });
}

function openSettingModal() {
  settingModal.dataset.mode = 'modify';
  settingModal.hidden = false;
}

worker.onmessage = (event) => {
  const remaining = event.data.remaining;

  const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = getDisplayFormat(minutes, seconds);

  timerDisplay.textContent = formattedTime;

  // 남은 시간이 0보다 크면 타이머 종료 동작하지 않기
  if (remaining > 0) return;

  timer.stopTimer();
  if (mainApp.dataset.state === 'work') {
    timer.changeState(State.BREAK);
    showNotification('짧은 휴식 시작!');
    timer.startTimer();
  } else if (mainApp.dataset.state === 'break') {
    if (timer.currentCycle > 1) {
      timer.changeState(State.WORK);
      timer.currentCycle--;
    } else {
      timer.changeState(State.LONG_BREAK);
      showNotification('모든 주기 종료\n긴 휴식 시작!');
    }
    timer.startTimer();
  } else if (mainApp.dataset.state === 'long-break') {
    timer.changeState(State.WORK);
    showNotification('뽀모도로 종료');
  }
};

function formatTimeInput(input) {
  let value = input.value.replace(/\D/g, ''); // 숫자만 남기기
  if (!value) {
    input.value = '';
    return;
  }

  let sec = parseInt(value.slice(-2)) || 0; // 뒤 2자리는 초
  let min = parseInt(value.slice(0, -2)) || 0; //나머지는 분

  if (sec >= 60) {
    min += Math.floor(sec / 60);
    sec = sec % 60;
  }

  input.value = getDisplayFormat(min, sec);
}

function getDisplayFormat(min, sec) {
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function verify() {
  // 값이 없으면 기본값으로 설정
  if (!workTimeInput.value) workTimeInput.value = '25:00';
  if (!breakTimeInput.value) breakTimeInput.value = '05:00';
  if (!longBreakTimeInput.value) longBreakTimeInput.value = '15:00';
  if (!cycleInput.value) cycleInput.value = '1';

  const workTime = workTimeInput.value;
  const breakTime = breakTimeInput.value;
  const longBreakTime = longBreakTimeInput.value;
  const cycle = cycleInput.value;

  if (
    workTime === '00:00' ||
    breakTime === '00:00' ||
    longBreakTime === '00:00'
  ) {
    // todo 근본적으로 alert 방식에서 벗어나는 건 어떨까
    alert('⚠️ 타이머 시간은 00:00일 수 없습니다!');
    return;
  }

  if (
    isNaN(cycle) ||
    !Number.isInteger(parseFloat(cycle)) ||
    parseInt(cycle) <= 0
  ) {
    alert('⚠️ 주기는 0보다 큰 정수만 가능합니다!');
    return;
  }

  const timeRegex = /^\d{2,}:\d{2}$/;
  if (
    !timeRegex.test(workTime) ||
    !timeRegex.test(breakTime) ||
    !timeRegex.test(longBreakTime)
  ) {
    alert('⚠️ 시간 형식이 잘못되었습니다. (예: 25:00)');
    return;
  }

  // 모든 검증을 통과하면 모달을 숨기고 활성화 페이지로 전환
  document.querySelector('.timer-create-area').hidden = true;
  settingModal.hidden = true;
  document.querySelector('.timer-active-area').hidden = false;

  alert(
    `✅ 타이머 생성 완료!\n활동: ${workTime}\n휴식: ${breakTime}\n
    긴 휴식: ${longBreakTime}\n주기: ${parseInt(cycle)}`
  );

  timer.setTime(workTime, breakTime, longBreakTime, cycle);

  // 다른 탭에서 수정하더라도 일할 시간 탭으로 돌아오게 하기
  timer.changeState(State.WORK);
}
