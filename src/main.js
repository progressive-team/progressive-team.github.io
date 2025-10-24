import 'normalize.css';
import '@noonnu/bmjua';

const mainApp = document.querySelector('main.app');

const createArea = document.querySelector('.timer-create-area');
const settingModal = document.querySelector('.timer-setting-modal');
const activeArea = document.querySelector('.timer-active-area');

const createButton = document.querySelector('#create-timer');
const closeButton = document.querySelector('button[aria-label="닫기"]');

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const longBreakTimeInput = document.getElementById('long-break-time');
const cycleInput = document.getElementById('cycle');
workTimeInput.value = '25:00';
breakTimeInput.value = '05:00';
longBreakTimeInput.value = '15:00';
cycleInput.value = '1';

const tabButton = document.querySelectorAll('.tab-button');

const timerDisplay = document.querySelector('.timer-display');
const startButton = document.querySelector('.start-button');
const settingGuide = document.querySelector('.setting-guide');

createButton.addEventListener('click', () => {
  settingModal.hidden = false;
});

closeButton.addEventListener('click', () => {
  settingModal.hidden = true;
});

tabButton.forEach((button) => {
  button.addEventListener('click', () => {
    tabButton.forEach((button) => {
      button.classList.remove('active');
    });
    button.classList.add('active');

    const buttonText = button.textContent;
    if (buttonText === '일할 시간') {
      mainApp.dataset.state = 'work';
      timerDisplay.textContent = '25:00';
    } else if (buttonText === '짧은 휴식') {
      mainApp.dataset.state = 'break';
      timerDisplay.textContent = '05:00';
    } else if (buttonText === '긴 휴식') {
      mainApp.dataset.state = 'long-break';
      timerDisplay.textContent = '40:00';
    }
  });
});

settingGuide.addEventListener('click', () => {
  settingModal.dataset.mode = 'modify';
  settingModal.hidden = false;
});

let isTimerRunning = false;

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

startButton.addEventListener('click', () => {
  if (isTimerRunning) {
    worker.postMessage({ command: 'stop' });

    isTimerRunning = false;
    startButton.textContent = '시작';
    settingGuide.hidden = false;
  } else {
    const timerString = timerDisplay.textContent;
    const parts = timerString.split(':');
    const duration = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;

    worker.postMessage({ command: 'start', duration: duration });

    isTimerRunning = true;
    startButton.textContent = '중지';
    settingGuide.hidden = true;
  }
});

worker.onmessage = (event) => {
  const { type, remaining } = event.data;

  if (type === 'tick') {
    updateTimerDisplay(remaining);
  } else if (type === 'end') {
    updateTimerDisplay(0);
    isTimerRunning = false;
    startButton.textContent = '시작';
    settingGuide.hidden = false;
  }
};

function updateTimerDisplay(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  timerDisplay.textContent = formattedTime;
}

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

  input.value = `${String(min).padStart(2, '0')}:${String(sec).padStart(
    2,
    '0'
  )}`;
}

const timeInputs = document.querySelectorAll(
  '#work-time, #break-time, #cycle, #long-break-time'
);

timeInputs.forEach((input) => {
  input.addEventListener('focus', () => {
    input.value = ''; //입력 시 값 비우기
  });

  input.addEventListener('blur', () => {
    if (input.id !== 'cycle') formatTimeInput(input); //주기를 제외하고 타이머 값 포맷팅
    if (!input.value) {
      // 값이 비어있으면 기본값을 다시 설정
      if (input.id === 'work-time') input.value = '25:00';
      else if (input.id === 'break-time') input.value = '05:00';
      else if (input.id === 'cycle') input.value = '1';
      else if (input.id === 'long-break-time') input.value = '15:00';
    }
  });
});

//만들기 버튼 클릭 시 검증 로직
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', () => {
  const workTime = document.getElementById('work-time').value;
  const breakTime = document.getElementById('break-time').value;
  const longBreakTime = document.getElementById('long-break-time').value;
  const cycle = document.getElementById('cycle').value;

  if (
    workTime === '00:00' ||
    breakTime === '00:00' ||
    longBreakTime === '00:00'
  ) {
    alert('⚠️ 타이머 시간은 00:00일 수 없습니다!');
    return;
  }

  /*
        if (!workTime || !breakTime || !longBreakTime || !cycle) {
          alert('⚠️ 모든 항목을 입력해주세요!');
          return;
        }*/

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

  alert(
    `✅ 타이머 생성 완료!\n활동: ${workTime}\n휴식: ${breakTime}\n긴 휴식: ${longBreakTime}\n주기: ${parseInt(
      cycle
    )}`
  );
  createArea.hidden = true;
  settingModal.hidden = true;
  activeArea.hidden = false;
});
