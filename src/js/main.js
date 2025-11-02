import 'normalize.css';
import '@noonnu/bmjua';

import Timer, { State } from './timer.js';
import { formatTimeInput, getDisplayFormat } from './util.js';

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

const settingModal = document.querySelector('.timer-setting-modal');

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const longBreakTimeInput = document.getElementById('long-break-time');
const cycleInput = document.getElementById('cycle');
const timeInputs = document.querySelectorAll(
  '#work-time, #break-time, #cycle, #long-break-time'
);

timeInputs.forEach((input) => {
  input.addEventListener('blur', () => {
    if (input.id !== 'cycle') formatTimeInput(input); //주기를 제외하고 타이머 값 포맷팅
  });
});

const tabs = document.querySelectorAll(
  '.tab-list[role="tablist"] > [role="tab"]'
);
const settingGuide = document.querySelector('.setting-guide');

const timer = new Timer(
  document.querySelector('main.app'),
  document.querySelector('.timer-display'),
  tabs,
  settingGuide,
  worker
);

document.querySelector('#create-timer').addEventListener('click', () => {
  settingModal.hidden = false;
});
document
  .querySelector('button[aria-label="닫기"]')
  .addEventListener('click', () => {
    settingModal.hidden = true;
  });

workTimeInput.value = timer.workTime;
breakTimeInput.value = timer.breakTime;
longBreakTimeInput.value = timer.longBreakTime;
cycleInput.value = timer.totalCycle;

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    // 이미 선택되어 있는 상태에서는 다시 선택 로직이 동작하지 않게끔 하기
    if (tab.ariaSelected === 'true') return;

    // 버튼마다 기능 동작시키기
    timer.runByButton(tab.dataset.keyword);

    // 다른 버튼 눌러서 넘어갈 때 타이머가 동작할 경우 타이머를 멈추게 하기
    if (timer.isTimerRunning()) {
      timer.stopTimer();
    }
  });
});

settingGuide.addEventListener('click', openSettingModal);

//만들기 버튼 클릭 시 검증 로직
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', verify);

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  if (timer.isTimerRunning()) {
    timer.resetTimer();
  } else {
    timer.startTimer();
  }
});

function openSettingModal() {
  if (timer.isTimerRunning()) return;

  settingModal.dataset.mode = 'modify';
  settingModal.hidden = false;
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

  // 모든 검증을 통과하면 타이머를 생성하라는 초기 페이지와 시간 설정 모달을 숨기고 실제 타이머 페이지로 전환
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

worker.onmessage = (event) => {
  const remaining = event.data.remaining;

  const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = getDisplayFormat(minutes, seconds);
  timer.setTimerDisplay(formatted);

  // 남은 시간이 0보다 크면 타이머 종료 동작하지 않기
  if (remaining > 0) return;

  timer.skipNextPhase();
};
