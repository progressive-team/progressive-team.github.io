<script lang="ts">
  // 얘 getDisplayFormat 안 씀
  import { formatTimeInput, getDisplayFormat } from '../lib/utils/formatUtil';
  import {
    showTimerActiveArea,
    showTimerCreateArea,
  } from '../stores/visibilityStore.svelte';
  import { timerStore } from '../stores/timerStore.svelte';
  import Timer from '../lib/models/Timer.svelte';

  // state 가 아닌데도 bind:value 가 됨.
  let workTime: string =
    timerStore.value === null ? '25:00' : timerStore.value.workTime;
  let breakTime: string =
    timerStore.value === null ? '05:00' : timerStore.value.breakTime;
  let cycle: number =
    timerStore.value === null ? 1 : timerStore.value.totalCycle;
  let longBreakTime: string =
    timerStore.value === null ? '15:00' : timerStore.value.longBreakTime;

  function verify() {
    // 값이 없으면 기본값 설정
    if (!workTime) workTime = '25:00';
    if (!breakTime) breakTime = '05:00';
    if (!longBreakTime) longBreakTime = '15:00';
    if (!cycle) cycle = 1;

    if (
      workTime === '00:00' ||
      breakTime === '00:00' ||
      longBreakTime === '00:00'
    ) {
      alert('⚠️ 타이머 시간은 00:00일 수 없습니다!');
      return;
    }
    if (isNaN(cycle) || !Number.isInteger(cycle) || cycle <= 0) {
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
      `✅ 타이머 설정 완료!\n활동: ${workTime}\n휴식: ${breakTime}\n긴 휴식: ${longBreakTime}\n주기: ${cycle}`,
    );
    showTimerActiveArea();

    // 타이머가 없으면 생성
    if (timerStore.value === null) {
      timerStore.value = new Timer();
    }
    // 타이머 시간 설정
    timerStore.value.setTime(workTime, breakTime, longBreakTime, cycle);
    timerStore.value.changeState('work');
  }
</script>

<section
  class="timer-setting-modal overlay
  absolute top-0 left-0 z-1 flex h-full w-full
  items-center justify-center bg-black/25"
  data-mode="create"
>
  <div
    id="setting-timer"
    class="relative m-[clamp(16px,4vw,24px)] flex max-w-[620px]
    flex-col items-center
    gap-[18px] rounded-[6px] bg-[var(--main-theme-color)]
    p-[clamp(16px,4vw,24px)] shadow-[0_8px_4px_0_rgba(0,0,0,0.25)]"
  >
    <header
      class="close-row
      grid w-full grid-cols-[1fr_auto_1fr]
      items-center gap-x-[1rem]"
    >
      <h2 class="col-2 m-0 text-[36px] font-normal">시간설정</h2>
      <!---todo 닫기 버튼 눌렀을 때 이전 상태로 돌아가야 함.-->
      <button
        class="col-3 h-[48px] w-[48px] justify-self-end border-none bg-transparent p-0 text-[var(--main-color)]"
        aria-label="닫기"
        type="button"
        onclick={() => {
          timerStore.value === null
            ? showTimerCreateArea()
            : showTimerActiveArea();
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48">
          <path
            d="M12.8 38L10 35.2L21.2 24L10 12.8L12.8 10L24 21.2L35.2 10L38 12.8L26.8 24L38 35.2L35.2 38L24 26.8L12.8 38Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </header>
    <fieldset
      class="row-box
      m-0 grid grid-cols-[minmax(max-content,1fr)_minmax(0,3fr)]
      gap-[20px_10px] border-none
      p-[0_34px] text-[clamp(1.25rem,4vw,24px)]
      
      not-italic [&>input]:rounded-[8px] [&>input]:border-none [&>input]:bg-white/30

      [&>input]:[padding-block:clamp(6px,2.5vmin,8px)]
      [&>input]:text-center [&>input]:text-[2em] [&>input]:leading-[100%]
      [&>input]:font-normal [&>input]:tracking-[-1.056px]
      [&>input]:text-current [&>input]:shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)] [&>input]:placeholder:text-current [&>input]:placeholder:opacity-40 [&>label]:self-center [&>label]:text-right

      [&>label]:font-normal [&>label]:tracking-[-0.528px]"
    >
      <label for="work-time">활동 시간</label>
      <input
        id="work-time"
        inputmode="numeric"
        placeholder="25:00"
        bind:value={workTime}
        onblur={() => {
          workTime = formatTimeInput(workTime);
        }}
      />

      <label for="break-time">휴식 시간</label>
      <input
        id="break-time"
        inputmode="numeric"
        placeholder="05:00"
        bind:value={breakTime}
        onblur={() => {
          breakTime = formatTimeInput(breakTime);
        }}
      />

      <label for="cycle">주기</label>
      <input
        id="cycle"
        name="cycle"
        type="number"
        inputmode="numeric"
        placeholder="1"
        min="1"
        bind:value={cycle}
      />

      <label for="long-break-time">긴 휴식 시간</label>
      <input
        id="long-break-time"
        inputmode="numeric"
        placeholder="15:00"
        bind:value={longBreakTime}
        onblur={() => {
          longBreakTime = formatTimeInput(longBreakTime);
        }}
      />
    </fieldset>
    <button
      type="submit"
      id="generateBtn"
      class="generate-row
      flex items-center justify-center rounded-[8px] border-none
      bg-white/40 p-[2px_31px] text-center
      font-['BMJUA'] text-[29px] leading-[150%] font-normal tracking-[-0.616px] text-current not-italic shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)]"
      aria-label="시간 설정"
      onclick={verify}
      >{timerStore.value === null ? '만들기' : '수정하기'}</button
    >
  </div>
</section>
