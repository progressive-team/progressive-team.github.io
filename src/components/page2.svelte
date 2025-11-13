<script lang="ts">
  import '../app.css';
  import { formatTimeInput, getDisplayFormat } from '../lib/utils/formatUtil';
  import {
    showTimerActiveArea,
    goBack,
  } from '../stores/visibilityStore.svelte';
  import { timerStore } from '../stores/timerStore.svelte';

  let workTime: string = '25:00';
  let breakTime: string = '05:00';
  let cycle: number = 1;
  let longBreakTime: string = '15:00';

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

    // 타이머 시간 설정
    timerStore.value?.setTime(workTime, breakTime, longBreakTime, cycle);
    timerStore.value?.changeState('work');
  }
</script>

<!-- 이거 data set 벗어나서 스벨트 if 블록으로 상태별 generateBtn 내용물을 수정하기, 생성하기로 바꿔줘야 함.-->
<section class="timer-setting-modal overlay" data-mode="create">
  <div id="setting-timer">
    <header class="close-row">
      <h2>시간설정</h2>
      <!---todo 닫기 버튼 눌렀을 때 이전 상태로 돌아가야 함.-->
      <button aria-label="닫기" type="button" onclick={goBack}>
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
      class="generate-row"
      aria-label="시간 설정"
      onclick={verify}
      >{timerStore.value === null ? '만들기' : '수정하기'}</button
    >
  </div>
</section>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  #setting-timer {
    position: relative;
    display: flex;
    max-width: 620px;
    padding: clamp(16px, 4vw, 24px);
    margin: clamp(16px, 4vw, 24px);
    flex-direction: column;
    align-items: center;
    gap: 18px;
    background: var(--main-theme-color);
    border-radius: 6px;
    box-shadow: 0 8px 4px 0 rgba(0, 0, 0, 0.25);
  }

  .close-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 1rem;

    h2 {
      grid-column: 2;
      margin: 0;
      font-size: 36px;
      font-weight: 400;
    }

    button[aria-label='닫기'] {
      grid-column: 3;
      justify-self: end;
      width: 48px;
      height: 48px;
      padding: 0;
      border: none;
      background: none;
      color: var(--main-color);
    }
  }

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

  fieldset.row-box {
    margin: 0;
    padding: 0 34px;
    border: none;

    display: grid;
    gap: 20px 10px;
    font-size: clamp(1.25rem, 4vw, 24px);

    grid-template-columns: minmax(max-content, 1fr) minmax(0, 3fr);

    > label {
      text-align: right;
      align-self: center;
      font-weight: 400;
      letter-spacing: -0.528px;
    }

    > input {
      padding-block: clamp(6px, 2.5vmin, 8px);
      border: none;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      box-shadow:
        0 8px 12px 6px rgba(0, 0, 0, 0.15),
        0 4px 4px 0 rgba(0, 0, 0, 0.3);
      color: currentColor;

      &::placeholder {
        color: currentColor;
        opacity: 0.4;
      }

      text-align: center;
      font-size: 2em;
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      letter-spacing: -1.056px;
    }
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

  .generate-row {
    display: flex;
    padding: 2px 31px;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    box-shadow:
      0 8px 12px 6px rgba(0, 0, 0, 0.15),
      0 4px 4px 0 rgba(0, 0, 0, 0.3);
    border: none;
    color: currentColor;
    text-align: center;
    font-family: BMJUA;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    letter-spacing: -0.616px;
  }
</style>
