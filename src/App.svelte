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
