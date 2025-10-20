import 'normalize.css';
import '@noonnu/bmjua';

const mainApp = document.querySelector('main.app');

const createArea = document.querySelector('.timer-create-area');
const settingModal = document.querySelector('.timer-setting-modal');
const activeArea = document.querySelector('.timer-active-area');

const createButton = document.querySelector('#create-timer');
const confirmButton = document.querySelector('.generate-row');
const closeButton = document.querySelector('button[aria-label="닫기"]');

const tabButton = document.querySelectorAll('.tab-button');

const timerDisplay = document.querySelector('.timer-display');
const settingGuide = document.querySelector('.setting-guide');

createButton.addEventListener('click', () => {
  settingModal.hidden = false;
});

/* 설정하기 버튼 클릭 시의 입력 값 검증 로직 내부로 이동
confirmButton.addEventListener('click', () => {
  createArea.hidden = true;
  settingModal.hidden = true;
  activeArea.hidden = false;
});
*/

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
  input.addEventListener('blur', () => {
    if (input.id !== 'cycle') formatTimeInput(input); //주기를 제외하고 타이머 값 포맷팅
  });
});

//만들기 버튼 클릭 시 검증 로직
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', () => {
  const workTimeInput = document.getElementById('work-time');
  const breakTimeInput = document.getElementById('break-time');
  const longBreakTimeInput = document.getElementById('long-break-time');
  const cycleInput = document.getElementById('cycle');

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
  createArea.hidden = true;
  settingModal.hidden = true;
  activeArea.hidden = false;

  alert(
    `✅ 타이머 생성 완료!\n활동: ${workTime}\n휴식: ${breakTime}\n긴 휴식: ${longBreakTime}\n주기: ${parseInt(
      cycle
    )}`
  );
});
