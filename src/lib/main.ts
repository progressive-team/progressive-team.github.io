import 'normalize.css';
import '@noonnu/bmjua';

import Timer, { State } from './timer';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

const settingModal = document.querySelector<HTMLElement>(
  '.timer-setting-modal',
);

const tabs = document.querySelectorAll<HTMLElement>(
  '.tab-list[role="tablist"] > [role="tab"]',
);
const settingGuide = document.querySelector<HTMLElement>('.setting-guide');

const timer = new Timer(
  document.querySelector<HTMLElement>('main.app'),
  document.querySelector<HTMLElement>('.timer-display'),
  tabs,
  settingGuide,
  worker,
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
cycleInput.value = `${timer.totalCycle}`;

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

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  if (timer.isTimerRunning()) {
    timer.resetTimer();
  } else {
    timer.initTimer();
    timer.startTimer();
  }
});

function openSettingModal() {
  if (timer.isTimerRunning()) return;

  settingModal.dataset.mode = 'modify';
  settingModal.hidden = false;
}

//입력값 검증 로직(일부 구현)
function verify() {
  //(구현 완료 - 삭제됨)값이 없는 경우 기본값으로 설정하기

  // 이미 생성된 타이머가 있으면 값 받아오기
  const workTime = workTimeInput.value;
  const breakTime = breakTimeInput.value;
  const longBreakTime = longBreakTimeInput.value;
  const cycle = Number(cycleInput.value);

  //(구현 완료 - 삭제됨)입력값 검증 과정

  // 모든 검증을 통과하면 타이머를 생성하라는 초기 페이지와 시간 설정 모달을 숨기고 실제 타이머 페이지로 전환

  //(구현 완료 - 삭제됨)타이머 생성 알림(alert)
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
