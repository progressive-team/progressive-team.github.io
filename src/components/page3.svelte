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

<section
  class="timer-active-area
  flex flex-col shrink-0 items-center justify-center gap-[56px] self-stretch p-[56px]"
>
  <div
    class="inner-box
    flex flex-col items-center gap-[48px] self-stretch rounded-[8px] bg-[rgba(255,255,255,0.15)]
    px-[clamp(16px,8vw,84px)] pt-[clamp(24px,5vmin,48px)] pb-[clamp(12px,3vmin,18px)]"
  >
    <!-- todo: 컴포넌트화해서 캡슐화하는 거 가능성: props 로 탭 정보 넘겨주기  -->
    <ul
      class="tab-list
      flex list-none p-0 m-0"
      role="tablist">
      {#each tabs as tab}
        <li
          class="group"
          role="tab"
          aria-selected={tab.keyword === timerStore.value?.timerState}
          data-keyword={tab.keyword}
        >
          <button
            class="
              flex px-[clamp(8px,3.5vw,16px)] py-[clamp(6px,1.5vmin,8px)]
              justify-center items-center bg-white/0 border-none rounded-[8px]
              text-[var(--main-text-color)] text-center text-[15px]
              not-italic font-normal leading-[100%] tracking-[-0.33px]
              transition-colors duration-[0.2s]
              
              hover:bg-black/15
              
              group-aria-selected:bg-black/15"
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
    <div
      class="frame flex flex-col items-center gap-[18px] w-[min(36vw,400px)]"
    >
      <div
        class="timer-display
        text-white text-center text-[clamp(48px,14vw,128px)] not-italic
        font-normal leading-[100%] tracking-[-2.944px]"
      >{timerStore.value?.timerDisplay}</div>
      <div
        class="button-group
        flex flex-col items-center gap-[18px] w-full"
      >
        <button
          class="start-button
          inline-flex px-0 py-[clamp(8px,2vw,14px)]
          transition-[border,color] duration-[0.5s] ease
          border-[2px] border-[var(--main-theme-color)]
          justify-center items-center w-full max-w-[400px] rounded-[8px] bg-[#fdfdfd]
          shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)]
          text-[var(--main-theme-color)] text-[28px] text-center not-italic font-normal
          leading-[150%] tracking-[-0.616px]
          
          hover:brightness-95
          active:brightness-85"
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
          text-[#404040] text-center text-[20px] not-italic font-normal
          leading-[100%] tracking-[-0.44px] m-0 break-keep

          before:content-['<클릭해서_시간_설정하기>'] before:text-[#404040]

          [&.running]:before:content-[attr(data-cycle-context)]
          [&.running]:before:text-white

          [&.running.long-break]:before:content-['긴_휴식_시간입니다._재정비하세요.']
          [&.running.long-break]:before:text-white
  
          {timerStore.value?.runState ? 'running' : ''}
          {timerStore.value?.timerState === 'long-break' ? 'long-break' : ''}"
          data-cycle-context={`타이머 주기 : ${timerStore.value?.currentCycle}/${timerStore.value?.totalCycle}`}
          onclick={() => {
            if (!timerStore.value.runState) {
              openSettingModal();
            }
          }}
        ></p>
      </div>
    </div>
  </div>
  <div
    class="inner-box
    flex flex-col items-center gap-[48px] self-stretch rounded-[8px] bg-[rgba(255,255,255,0.15)]
    px-[clamp(16px,8vw,84px)] pt-[clamp(24px,5vmin,48px)] pb-[clamp(12px,3vmin,18px)]"
  >
    <div
      class="frame
      flex flex-col items-center w-[min(36vw,400px)]
      gap-0 shadow-[0_8px_12px_6px_rgba(0,0,0,0.15),0_4px_4px_0_rgba(0,0,0,0.3)]"
    >
      <div
        class="progressive-box
        flex max-w-[400px] items-center justify-between self-stretch rounded-[8px_8px_0_0]
        bg-[#fdfdfd] p-[14px_40px]"
      >
        <span
          class="progressive-label
          text-center text-[28px] leading-[150%]
          font-normal tracking-[-0.616px]
          text-[var(--main-theme-color)] not-italic">점진적 시간 증감</span
        >
        <label class="switch-box inline-block relative w-[100px] h-[46px]">
          {#if timerStore.value}
            <input
              class="opacity-0 w-0 h-0 peer"
              type="checkbox"
              bind:checked={timerStore.value.isToggle}
              onclick={() => {
                timerStore.value.isToggle = !timerStore.value.isToggle;
              }}
            />
          {/if}
          <span
            class="slider
            absolute cursor-pointer top-0 left-0 right-0 bottom-0
            bg-[#cac4d0] rounded-[34px] transition-all transition-[0.4s]
            
            before:absolute before:content-[''] before:h-[36px] before:w-[36px]
            before:left-[5px] before:bottom-[5px] before:bg-white 
            before:transition-all before:transition-[0.4s] before:rounded-[50%]
            
            peer-checked:bg-[var(--main-theme-color)]

            peer-checked:before:translate-x-[54px]"
          ></span>
        </label>
      </div>
      <div
        class="flex flex-col p-[14px] justify-center gap-[20px] self-stretch
        rounded-[0_0_8px_8px] m-0 bg-[#e7e7e7]
        border-t border-dashed border-black"
      >
        <p
          class="progressive-text
          text-[#454545] text-[20px] not-italic font-normal text-center
          leading-[150%] tracking-[-0.396px] m-0"
        >
          점진적 시간 증감 여부 설정
        </p>
        <p
          class="progressive-text
          text-[#454545] text-[18px] not-italic font-normal
          leading-[150%] tracking-[-0.396px] m-0"
        >
          1. 타이머를 완주하면 다음 타이머의 ‘일할 시간’이 자동으로 5분
          증가합니다. <br />2. 반대로 타이머가 도중에 중지(포기)되면 다음
          타이머의 ‘일할 시간’이 5분 감소합니다. <br />특정 시간대로 계속
          사용하고 싶을 때 증감 여부 설정을 끌 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</section>
