<script lang="ts">
  import { timers } from '../stores/timerStore.svelte';
  import { visibility, showSettingModal } from '../stores/visibilityStore.svelte';

  const tabs = [
    { keyword: 'work', label: '일할 시간', selected: true },
    { keyword: 'break', label: '짧은 휴식', selected: false },
    { keyword: 'long-break', label: '긴 휴식', selected: false },
  ] as const;

  function tabClick(clickedTab: {
    keyword: string;
    label: string;
    selected: boolean;
  }) {
    // 이미 선택되어 있는 상태에서는 다시 선택 로직이 동작하지 않게끔 하기
    if (clickedTab.selected === true) return;

    // 버튼마다 기능 동작시키기
    timer.runByButton(clickedTab.keyword);

    // 다른 버튼 눌러서 넘어갈 때 타이머가 동작할 경우 타이머를 멈추게 하기
    if (timerState === 'running') {
      timer.stopTimer();
    }
  }

  function startButtonClick() {
    if (timerState === 'running') {
      timer.resetTimer();
    } else {
      timer.initTimer();
      timer.startTimer();
    }
  }

  function openSettingModal() {
    if (timerState === 'running') return;

    // TODO: if 블록으로 관리
    // settingModal.dataset.mode = 'modify';
    showSettingModal();
  }
</script>

<section class="timer-active-area">
  <div class="inner-box">
    <ul class="tab-list" role="tablist">
      {#each tabs as tab}
        <li role="tab" aria-selected={tab.selected} data-keyword={tab.keyword}>
          <button
            onclick={() => {
              tabClick(tab);
            }}>{tab.label}</button
          >
        </li>
      {/each}
    </ul>
    <div class="frame">
      <div class="timer-display">25:00</div>
      <div class="button-group">
        <button class="start-button" onclick={startButtonClick}></button>
        <p class="setting-guide" onclick={openSettingModal}></p>
      </div>
    </div>
  </div>
</section>

<style>
  .timer-active-area {
    display: flex;
    padding: 56px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    align-self: stretch;
  }

  .inner-box {
    display: flex;

    padding-inline: clamp(16px, 8vw, 84px); /* 좌/우: 16px ~ 84px */
    padding-block-start: clamp(24px, 5vmin, 48px); /* 위: 24px ~ 48px */
    padding-block-end: clamp(12px, 3vmin, 18px); /* 아래: 12px ~ 18px */

    flex-direction: column;
    align-items: center;
    gap: 48px;
    align-self: stretch;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
  }

  .tab-list[role='tablist'] {
    display: flex;
    list-style-type: '';
    padding: 0;
    margin: 0;

    [role='tab'] {
      & > button {
        display: flex;

        /* 가변 패딩으로 작은 가로 뷰포트에서 축소하기 */
        padding-block: clamp(6px, 1.5vmin, 8px);
        padding-inline: clamp(8px, 3.5vw, 16px);

        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0);
        border: none;
        border-radius: 8px;
        transition: background-color 0.2s;
        color: var(--main-text-color);
        text-align: center;
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 15px */
        letter-spacing: -0.33px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.15);
        }
      }

      &[aria-selected='true'] > button {
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }

  .frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    width: min(36vw, 400px);
  }

  .timer-display {
    color: #fff;
    text-align: center;
    /* 뷰포트 기준: 최소 48px ~ 최대 128px */
    font-size: clamp(48px, 14vw, 128px);
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 128px */
    letter-spacing: -2.944px;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    width: 100%;
  }

  .start-button {
    display: inline-flex;

    padding-inline: 0;
    padding-block: clamp(8px, 2vw, 14px);

    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    background: #fdfdfd;
    box-shadow:
      0 8px 12px 6px rgba(0, 0, 0, 0.15),
      0 4px 4px 0 rgba(0, 0, 0, 0.3);
    border: 2px solid var(--main-theme-color);
    color: var(--main-theme-color);
    font-size: 28px;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 42px */
    letter-spacing: -0.616px;
    transition:
      border 0.5s ease,
      color 0.5s ease;
  }

  :global(.app[data-timer-state='stopped']) .start-button::before {
    content: '시작';
  }

  :global(.app[data-timer-state='running']) .start-button::before {
    content: '중지';
  }

  .start-button:hover {
    filter: brightness(0.95);
  }

  .start-button:active {
    filter: brightness(0.85);
  }

  .setting-guide {
    color: #404040;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 20px */
    letter-spacing: -0.44px;
    margin: 0; /* <p> 자체의 마진 제거 */
    word-break: keep-all;
  }

  :global(.app[data-timer-state='stopped']) .setting-guide::before {
    color: #404040;
    content: '<클릭해서 시간 설정하기>';
  }

  :global(.app[data-timer-state='running']) .setting-guide::before {
    color: #fff;
    content: '타이머 주기: ' attr(data-cycle-context);
  }

  :global(.app[data-timer-state='running'][data-state='long-break'])
    .setting-guide::before {
    color: #fff;
    content: '긴 휴식 시간입니다. 재정비하세요.';
  }
</style>
