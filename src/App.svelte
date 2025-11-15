<script lang="ts">
  import Page1 from './components/page1.svelte';
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
  import { currentPage } from './stores/visibilityStore.svelte';
</script>

<main class="app">
  {#if currentPage() == 'create'}
    <Page1 />
  {:else if currentPage() == 'setting'}
    <Page2 />
  {:else}
    <Page3/>
  {/if}
</main>

<style>
  @import 'tailwindcss';
  @import 'normalize.css';
  @import '@noonnu/bmjua';

  * {
    box-sizing: border-box;
  }

  body {
    overflow-y: auto;
    margin: 0;
  }

  main.app {
    --main-color: #fafaf8;
    --main-theme-color: #ed6b6b;

    font-family: BMJUA;
    color: var(--main-color);
    display: flex;
    position: relative;
    height: 576px;
    background: var(--main-theme-color);
    height: 100dvh;
    justify-content: center;
    align-items: center;
    transition: background-color 0.5s ease;
  }

  main.app[data-state='work'] {
    --main-theme-color: #ed6b6b;
  }

  main.app[data-state='break'] {
    --main-theme-color: #38858a;
  }

  main.app[data-state='long-break'] {
    --main-theme-color: #397097;
  }

  /* 타이머 생성 화면 */
  .timer-create-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 28px;
  }
  
    [hidden] {
    display: none !important;
  }

  #create-timer {
    display: flex;
    width: 90px;
    height: 90px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: var(--main-theme-color);
    border: none;
    background: #fff;
  }

  label[for='create-timer'] {
    display: block;
    font-size: 30px;
  }

  /* 이 아래는 2번째 페이지 입니다. */
  /* 타이머 설정창 */

  #ipsum {
    color: black;
  }
</style>
