<script lang="ts">
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
  absolute flex top-0 left-0 w-full h-full bg-black/25
  justify-center items-center z-1"
  data-mode="create"
>
  <div id="setting-timer"
    class="relative flex flex-col max-w-[620px]
    p-[clamp(16px,4vw,24px)] m-[clamp(16px,4vw,24px)]
    items-center gap-[18px] bg-[var(--main-theme-color)]
    rounded-[6px] shadow-[0_8px_4px_0_rgba(0,0,0,0.25)]"
  >
    <header
      class="close-row
      grid grid-cols-[1fr_auto_1fr] w-full
      items-center gap-x-[1rem]"
    >
      <h2 class="col-2 m-0 text-[36px] font-normal">시간설정</h2>
      <!---todo 닫기 버튼 눌렀을 때 이전 상태로 돌아가야 함.-->
      <button
        class="w-[48px] h-[48px] p-0 col-3 justify-self-end border-none bg-transparent text-[var(--main-color)]"
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
    <fieldset class="row-box
      m-0 p-[0_34px] border-none
      grid grid-cols-[minmax(max-content,1fr)_minmax(0,3fr)]
      gap-[20px_10px] text-[clamp(1.25rem,4vw,24px)]
      
      [&>label]:text-right [&>label]:self-center [&>label]:font-normal [&>label]:tracking-[-0.528px]

      [&>input]:[padding-block:clamp(6px,2.5vmin,8px)]
      [&>input]:border-none [&>input]:rounded-[8px] [&>input]:shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)]
      [&>input]:text-current [&>input]:bg-white/30 
      [&>input]:text-center [&>input]:!text-[2em] not-italic [&>input]:font-normal [&>input]:!leading-[100%] [&>input]:tracking-[-1.056px]

      [&>input]:placeholder:text-current [&>input]:placeholder:opacity-40"
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
      flex p-[2px_31px] justify-center items-center bg-white/40
      rounded-[8px] border-none shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)]
      text-current text-center font-['BMJUA'] not-italic font-normal tracking-[-0.616px]"
      style="font-size: 29px; line-height: 150%;"
      aria-label="시간 설정"
      onclick={verify}
      >{timerStore.value === null ? '만들기' : '수정하기'}</button
    >
  </div>
</section>

<style>
  .close-button {
    display: flex;
    position: absolute;
    right: 48px;
    width: 48px;
    height: 48px;
    aspect-ratio: 1/1;
    border: none;
    background: none;
    align-items: center;
    justify-content: center;
    color: #fdfdfd;
  }

  .time-row {
    display: flex;
    width: 503px;
    justify-content: space-between;
    align-items: center;
  }

  .time-row-label {
    width: 118px;
    height: 37px;
    flex-shrink: 0;
    color: #fdfdfd;
    text-align: right;
    font-family: BMJUA;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    letter-spacing: -0.528px;
  }

  .time-row-value {
    display: flex;
    width: 375px;
    padding: 8px 0;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    box-shadow:
      0 8px 12px 6px rgba(0, 0, 0, 0.15),
      0 4px 4px 0 rgba(0, 0, 0, 0.3);
    /* flex: 1 0 0; */
    color: #fdfdfd;
    text-align: center;
    font-family: BMJUA;
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: -1.056px;
  }
</style>
