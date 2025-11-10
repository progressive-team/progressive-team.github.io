<script lang="ts">
  import Page2 from './components/page2.svelte';

  // 객체지향의 상속/캡슐화 개념이 아니라서 visibility 를 그대로 넘겨줄 수밖에
  // 없는 것이 최선으로 보이며, 그에 따라 개발자가 visibility 를 임의로 조작하는 것을
  // 설계상 허용할 수밖에 없는 상태임을 유의해야 함.
  // getSettingModalVisibility(): boolean {return visibility.settingModal}과
  // 같은 방식으로 제어해볼까 생각했는데 $state 가 변할 때 저 함수가 호출될지를
  // 검증하지 않아 함부로 사용할 수 없는 상태임.
  // 그래서 일단 객체지향이 아니라는 점(==접근 제어 관리가 안 된다는 점)과 빠른
  // 구현을 해야 하는 지금 상황을 반영해 visibility 객체를 바로 넘겨주는 것을 선택함.
  //
  // 기본값이 false 이며 이는 숨겨진(hidden) 상태를 의미함. true로 바꿔야
  // 보이는 것을 의미함.
  import Page3 from './components/page3.svelte';
  
  const visibility = $state({
    timerCreateArea: false,
    settingModal: false,
    timerActiveArea: false,
  });

  // 객체를 계속 만들어둬야 한다고?
  // 타이머 객체를 차라리 여기서 미리 만들어서 그걸 시간 변경 가능하게끔 하기?
  const verifiedTimerInputs = $state({
    workTime: '',
    breakTime: '',
    longBreakTime: '',
    cycle: 1,
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
  function setTimerTime(
    workTime: string,
    breakTime: string,
    longBreakTime: string,
    cycle: number,
  ) {
    verifiedTimerInputs.workTime = workTime;
    verifiedTimerInputs.breakTime = breakTime;
    verifiedTimerInputs.longBreakTime = longBreakTime;
    verifiedTimerInputs.cycle = cycle;

    // 다른 탭에서 수정하더라도 일할 시간 탭으로 돌아오게 하기
    timer.changeState(State.WORK);
  }

  const parentInfo = {
    visibility,
    showSettingModal,
    hideSettingModal,
    hideTimerCreateArea,
    showTimerActiveArea,
    setTimerTime,
  };
</script>

<main class="app" data-state="work" data-timer-state="stopped">
  <Page2 {...parentInfo} />

  <Page3 />
</main>

<style>
</style>
