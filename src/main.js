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

confirmButton.addEventListener('click', () => {
  createArea.hidden = true;
  settingModal.hidden = true;
  activeArea.hidden = false;
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
  settingModal.hidden = false;
});
