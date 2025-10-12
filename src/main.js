import 'normalize.css';
import '@noonnu/bmjua';

const createArea = document.querySelector('.timer-create-area');
const settingModal = document.querySelector('.timer-setting-modal');
const activeArea = document.querySelector('.timer-active-area');

const createButton = document.querySelector('#create-timer');
const confirmButton = document.querySelector('.generate-row');
const closeButton = document.querySelector('button[aria-label="닫기"]');

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
