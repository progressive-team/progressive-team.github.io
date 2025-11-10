<script lang="ts">
  const tabs = [
    { keyword: 'work', label: '일할 시간', selected: true },
    { keyword: 'break', label: '짧은 휴식', selected: false },
    { keyword: 'long-break', label: '긴 휴식', selected: false },
  ];
</script>

<section class="timer-active-area" hidden>
  <div class="inner-box">
    <menu class="tab-list" role="tablist">
      {#each tabs as tab}
        <li role="tab" aria-selected={tab.selected} data-keyword={tab.keyword}>
          <button>{tab.label}</button>
        </li>
      {/each}
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
