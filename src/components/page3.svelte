<script lang="ts">
  import { timerStore } from '../stores/timerStore.svelte';
  import { showSettingModal } from '../stores/visibilityStore.svelte';
  import type { TimerState } from '../lib/models/Timer.svelte';

  type Tab = {
    keyword: TimerState;
    label: string;
  };

  const tabs: Tab[] = [
    { keyword: 'work', label: '일할 시간' },
    { keyword: 'break', label: '짧은 휴식' },
    { keyword: 'long-break', label: '긴 휴식' },
  ];

  function openSettingModal() {
    // TODO: if 블록으로 관리
    // settingModal.dataset.mode = 'modify';
    showSettingModal();
  }
</script>

<section class="timer-active-area">
  <div class="inner-box">
    <!-- todo: 컴포넌트화해서 캡슐화하는 거 가능성: props 로 탭 정보 넘겨주기  -->
    <ul class="tab-list" role="tablist">
      {#each tabs as tab}
        <li
          role="tab"
          aria-selected={tab.keyword === timerStore.value?.timerState}
          data-keyword={tab.keyword}
        >
          <button
            onclick={() => {
              if (
                !timerStore.value?.runState &&
                tab.keyword !== timerStore.value.timerState
              ) {
                timerStore.value.changeState(tab.keyword);
              }
            }}
          >
            {tab.label}
          </button>
        </li>
      {/each}
    </ul>
    <div class="frame">
      <div class="timer-display">{timerStore.value?.timerDisplay}</div>
      <div class="button-group">
        <button
          class="start-button"
          onclick={() => {
            if (timerStore.value.runState) {
              timerStore.value.reset();
            } else {
              timerStore.value.changeState('work');
              timerStore.value.start();
            }
          }}
        >
          {#if timerStore.value?.runState}
            중지
          {:else}
            시작
          {/if}
        </button>
        <p
          class="setting-guide
          {timerStore.value?.runState ? 'running' : ''}
          {timerStore.value?.timerState === 'long-break' ? 'long-break' : ''}"
          data-cycle-context={`${timerStore.value?.currentCycle}/${timerStore.value?.totalCycle}`}
          onclick={() => {
            if (!timerStore.value.runState) {
              openSettingModal();
            }
          }}
        ></p>
      </div>
    </div>
  </div>
  <div class="inner-box">
    <div
      class="frame"
      style="gap: 0px; box-shadow:
      0 8px 12px 6px rgba(0, 0, 0, 0.15),
      0 4px 4px 0 rgba(0, 0, 0, 0.3);"
    >
      <div class="progressive-box">
        <span class="progressive-label">점진적 시간 증감</span>
        <label class="switch-box">
          <input type="checkbox" id="progressive-toggle" />
          <span class="slider"></span>
        </label>
      </div>
      <p class="progressive-text">ㅁㅇㅁㅇㅁ</p>
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
    gap: 56px;
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

  .setting-guide::before {
    color: #404040;
    content: '<클릭해서 시간 설정하기>';
  }

  .setting-guide.running::before {
    color: #fff;
    content: '타이머 주기: ' attr(data-cycle-context);
  }

  .setting-guide.running.long-break::before {
    color: #fff;
    content: '긴 휴식 시간입니다. 재정비하세요.';
  }

  .progressive-box {
    display: flex;
    max-width: 400px;
    align-self: stretch;
    padding: 14px 40px;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px 8px 0 0;
    background: #fdfdfd;
  }

  .progressive-label {
    color: #ed6b6b;
    text-align: center;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 42px */
    letter-spacing: -0.616px;
  }

  .switch-box {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 46px;
  }

  .switch-box input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cac4d0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 36px;
    width: 36px;
    left: 5px;
    bottom: 5px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--main-theme-color);
  }

  input:checked + .slider:before {
    /* -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px); */
    transform: translateX(54px);
  }

  .progressive-text {
    display: flex;
    padding: 14px;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    border-radius: 0 0 8px 8px;
    border-top: 1px dashed #000;
    background: #e7e7e7;
    margin: 0px;
  }
</style>
