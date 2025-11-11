<script lang="ts">
  const visibility = $state({
    timerCreateArea: false,
    settingModal: false,
    timerActiveArea: false,
  });

  function hideSettingModal() {
    visibility.settingModal = false;
  }
  function showSettingModal() {
    visibility.settingModal = true;
  }
  function hideTimerCreateArea() {
    visibility.timerCreateArea = false;
  }
  function showTimerActiveArea() {
    visibility.timerActiveArea = true;
  }
</script>

<main class="app" data-state="work" data-timer-state="stopped">
  <section class="timer-create-area">
    <button id="create-timer">
      <svg viewBox="0 0 72 72" fill="none">
        <path
          d="M33 39H15V33H33V15H39V33H57V39H39V57H33V39Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <label for="create-timer">클릭해서 타이머를 추가하세요</label>
  </section>

  <section class="timer-setting-modal overlay" hidden data-mode="create">
    <div id="setting-timer">
      <header class="close-row">
        <h2>시간설정</h2>
        <button aria-label="닫기">
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
        <input id="work-time" inputmode="numeric" placeholder="25:00" />

        <label for="break-time">휴식 시간</label>
        <input id="break-time" inputmode="numeric" placeholder="05:00" />

        <label for="cycle">주기</label>
        <input id="cycle" name="cycle" type="number" placeholder="1" min="1" />

        <label for="long-break-time">긴 휴식 시간</label>
        <input id="long-break-time" inputmode="numeric" placeholder="15:00" />
      </fieldset>
      <button type="submit" id="generateBtn" class="generate-row"></button>
    </div>
  </section>

  <section class="timer-active-area" hidden>
    <div class="inner-box">
      <menu class="tab-list" role="tablist">
        <li role="tab" aria-selected="true" data-keyword="work">
          <button>일할 시간</button>
        </li>
        <li role="tab" data-keyword="break">
          <button>짧은 휴식</button>
        </li>
        <li role="tab" data-keyword="long-break">
          <button>긴 휴식</button>
        </li>
      </menu>
      <div class="frame">
        <div class="timer-display">25:00</div>
        <div class="button-group">
          <button class="start-button"></button>
          <p class="setting-guide"></p>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
</style>
