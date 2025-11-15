<script lang="ts">
  import {
    formatTimeInput,
    getDisplayFormat,
    requestNotificationPermission,
    showNotification,
  } from './lib/utils';

  let timerState = $state<'work' | 'break' | 'long-break'>('work');
  let timerRunningState = $state<'stopped' | 'running'>('stopped');
  let isTimerCreated = $state(false);
  let isSettingsModalVisible = $state(false);

  let settings = $state({
    workTime: '25:00',
    breakTime: '05:00',
    longBreakTime: '15:00',
    totalCycle: 1,
  });

  let remainingTime = $state(0);
  let currentCycle = $state(settings.totalCycle);

  // Derived state for display
  let displayTime = $derived.by(() => {
    const totalSeconds = Math.max(0, Math.ceil(remainingTime / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return getDisplayFormat(minutes, seconds);
  });

  let timeForCurrentState = $derived.by(() => {
    switch (timerState) {
      case 'work':
        return settings.workTime;
      case 'break':
        return settings.breakTime;
      case 'long-break':
        return settings.longBreakTime;
    }
  });

  const worker = new Worker('/timer.js');

  worker.onmessage = (event: MessageEvent) => {
    remainingTime = event.data.remainingTime;
    if (remainingTime <= 0) {
      skipNextPhase();
    }
  };

  // Effects
  $effect(() => {
    // Update remainingTime when the active timer state or its corresponding setting changes
    const rawParts = timeForCurrentState.split(':');
    if (rawParts.length === 1) rawParts.unshift('0');
    const parts = rawParts.map((value) => Number.parseInt(value, 10) || 0);
    const newTime = (parts[0] * 60 + parts[1]) * 1000;

    remainingTime = newTime;
    worker.postMessage({ command: 'reset', time: newTime });
  });

  $effect(() => {
    if (timerRunningState === 'running') {
      if (remainingTime > 0) {
        worker.postMessage({ command: 'start', time: remainingTime });
      }
    } else {
      worker.postMessage({ command: 'stop' });
    }
  });

  $effect(() => {
    return () => {
      worker.terminate();
    };
  });

  // Functions
  function showSettings(mode: 'create' | 'modify') {
    isSettingsModalVisible = true;
    // You can use the 'mode' parameter if you need different logic for create/modify
  }

  function hideSettings() {
    isSettingsModalVisible = false;
  }

  function createOrUpdateTimer() {
    // Validation
    if (
      settings.workTime === '00:00' ||
      settings.breakTime === '00:00' ||
      settings.longBreakTime === '00:00'
    ) {
      alert('⚠️ 타이머 시간은 00:00일 수 없습니다!');
      return;
    }
    if (settings.totalCycle <= 0) {
      alert('⚠️ 주기는 0보다 큰 정수만 가능합니다!');
      return;
    }

    currentCycle = settings.totalCycle;
    changeTimerState('work');
    isTimerCreated = true;
    hideSettings();

    alert(
      `✅ 타이머 설정 완료!\n활동: ${settings.workTime}\n휴식: ${settings.breakTime}\n긴 휴식: ${settings.longBreakTime}\n주기: ${settings.totalCycle}`,
    );
  }

  function toggleTimer() {
    if (timerRunningState === 'running') {
      resetTimer();
    } else {
      requestNotificationPermission();
      currentCycle = settings.totalCycle;
      timerRunningState = 'running';
    }
  }

  function resetTimer() {
    timerRunningState = 'stopped';
    currentCycle = settings.totalCycle;
    changeTimerState('work');
  }

  function changeTimerState(newState: 'work' | 'break' | 'long-break') {
    if (timerRunningState === 'running') {
      timerRunningState = 'stopped';
    }
    timerState = newState;
  }

  function skipNextPhase() {
    timerRunningState = 'stopped';
    let autoStart = false;

    switch (timerState) {
      case 'work':
        changeTimerState('break');
        showNotification(
          `짧은 휴식 시작. 현재 주기: ${currentCycle}/${settings.totalCycle}`,
        );
        autoStart = true;
        break;
      case 'break':
        if (currentCycle > 1) {
          currentCycle--;
          changeTimerState('work');
        } else {
          changeTimerState('long-break');
          showNotification('모든 주기 종료\n긴 휴식 시작');
        }
        autoStart = true;
        break;
      case 'long-break':
        changeTimerState('work');
        showNotification('뽀모도로 종료');
        break;
    }

    if (autoStart) {
      timerRunningState = 'running';
    }
  }
</script>

<main class="app" data-state={timerState} data-timer-state={timerRunningState}>
  {#if !isTimerCreated}
    <section class="timer-create-area">
      <button
        aria-label="타이머 생성"
        id="create-timer"
        onclick={() => showSettings('create')}
      >
        <svg viewBox="0 0 72 72" fill="none">
          <path
            d="M33 39H15V33H33V15H39V33H57V39H39V57H33V39Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <label for="create-timer">클릭해서 타이머를 추가하세요</label>
    </section>
  {/if}

  {#if isSettingsModalVisible}
    <section class="timer-setting-modal overlay" data-mode="create">
      <div id="setting-timer">
        <header class="close-row">
          <h2>시간설정</h2>
          <button aria-label="닫기" onclick={hideSettings}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <path
                d="M12.8 38L10 35.2L21.2 24L10 12.8L12.8 10L24 21.2L35.2 10L38 12.8L26.8 24L38 35.2L35.2 38L24 26.8L12.8 38Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </header>
        <fieldset class="row-box">
          <label for="work-time">활동 시간</label>
          <input
            id="work-time"
            inputmode="numeric"
            placeholder="25:00"
            bind:value={settings.workTime}
            onblur={formatTimeInput}
          />

          <label for="break-time">휴식 시간</label>
          <input
            id="break-time"
            inputmode="numeric"
            placeholder="05:00"
            bind:value={settings.breakTime}
            onblur={formatTimeInput}
          />

          <label for="cycle">주기</label>
          <input
            id="cycle"
            name="cycle"
            type="number"
            placeholder="1"
            min="1"
            bind:value={settings.totalCycle}
          />

          <label for="long-break-time">긴 휴식 시간</label>
          <input
            id="long-break-time"
            inputmode="numeric"
            placeholder="15:00"
            bind:value={settings.longBreakTime}
            onblur={formatTimeInput}
          />
        </fieldset>
        <button
          type="submit"
          id="generateBtn"
          class="generate-row"
          onclick={createOrUpdateTimer}
        ></button>
      </div>
    </section>
  {/if}

  {#if isTimerCreated}
    <section class="timer-active-area">
      <div class="inner-box">
        <ul class="tab-list" role="tablist">
          <li role="tab" aria-selected={timerState === 'work'}>
            <button onclick={() => changeTimerState('work')}>일할 시간</button>
          </li>
          <li role="tab" aria-selected={timerState === 'break'}>
            <button onclick={() => changeTimerState('break')}>짧은 휴식</button>
          </li>
          <li role="tab" aria-selected={timerState === 'long-break'}>
            <button onclick={() => changeTimerState('long-break')}
              >긴 휴식</button
            >
          </li>
        </ul>
        <div class="frame">
          <div class="timer-display">{displayTime}</div>
          <div class="button-group">
            <button class="start-button" onclick={toggleTimer}></button>
            <button
              class="setting-guide"
              onclick={() => {
                if (timerRunningState === 'stopped') showSettings('modify');
              }}
              data-cycle-context={`${currentCycle}/${settings.totalCycle}`}
            >
            </button>
          </div>
        </div>
      </div>
    </section>
  {/if}
</main>

<style>
  /* NOTE: The original styles from app.css and the vanilla css are not shown here for brevity */
  /* They are still applied from the global stylesheet */
</style>
