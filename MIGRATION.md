# Vanilla to Svelte 5 마이그레이션 가이드

이 문서는 `vanilla/` 디렉터리에 있는 순수 JavaScript 뽀모도로 타이머 웹
애플리케이션을 루트 경로의 Svelte 5 프로젝트로 마이그레이션하는 과정을
안내합니다.

## 2. 마이그레이션 단계

### 1단계: UI 마크업 및 스타일 복사

- **HTML 마크업**: `vanilla/index.html` 파일의 `<main>` 태그 내부에 있는 모든
  `<section>` 요소들을 `src/App.svelte` 파일의 `<main>` 태그 안으로 복사합니다.
- **CSS 스타일**: `vanilla/src/css/style.css` 파일의 모든 내용을 `src/app.css`
  파일에 복사합니다. (Tailwind 지시문 아래)

### 2단계: 핵심 로직 마이그레이션 (Svelte 5 Runes 활용)

`vanilla/src/js/main.js`에 있는 핵심 로직을 `src/App.svelte`의
`<script lang="ts">` 태그 안으로 옮기고, Svelte 5 스타일에 맞게 재작성합니다.

1. **상태(State) 정의**:
   - `main.js`에서 전역 변수로 관리되던 상태(예: `timer`, `remainingTime`,
     `status` 등)를 Svelte 5의 `$state` 룬을 사용하여 `App.svelte` 내에 반응형
     상태로 선언합니다.
2. **DOM 조작 코드 제거**:
   - `document.getElementById`, `classList.add/remove` 등 DOM을 직접 조작하는
     코드를 모두 제거합니다.
   - 대신, Svelte의 조건부 렌더링 (`{#if ...}`), 클래스 디렉티브
     (`class:name={condition}`), 데이터 바인딩 (`bind:value`)을 사용하여 UI를
     반응적으로 업데이트하도록 변경합니다.
   - `addEventListener`를 사용하던 부분을 Svelte 5 이벤트 스타일로 교체합니다.

### 3단계: 유틸리티 로직 통합 및 수정

`vanilla/src/js/` 폴더에 있던 `timer.js`, `notify.js`, `worker.js`, `util.js`
등의 유틸리티 함수들을 `App.svelte`의 `<script>` 내부로 가져오거나, `src/lib/`
디렉터리에 별도의 TypeScript 모듈(`*.ts`)로 분리하여 관리합니다.

- **`timer.js` / `worker.js`**: 타이머 로직은 Svelte의 생명주기
  함수(`$effect`)와 상태를 활용하여 재구현하는 것을 권장합니다. Web Worker
  로직은 필요시 그대로 `public` 폴더로 옮겨 사용하거나, Svelte 스토어와 통합할
  수 있습니다.
- **`notify.js`**: Notification API 로직은 `App.svelte` 내의 메소드로 변환하여
  필요할 때 호출하도록 수정합니다.
- **`util.js`**: 범용 헬퍼 함수들은 `src/lib/utils.ts`와 같은 파일로 옮겨
  `export/import`하여 사용합니다.

### 4단계: (선택) 리팩토링: 컴포넌트 분리

`App.svelte`가 너무 커지면 가독성과 유지보수성이 떨어질 수 있습니다. 아래와 같이
역할을 기준으로 컴포넌트를 분리하는 것을 권장합니다.

- `TimerDisplay.svelte`: 타이머 시간을 표시하는 UI
- `TimerControls.svelte`: 시작, 정지, 리셋 버튼
- `SettingsModal.svelte`: 타이머 설정을 위한 모달창

### 5단계: 최종 정리

마이그레이션이 완료되고 Svelte 앱이 `vanilla/` 버전과 동일하게 동작하는 것을
확인한 후, 프로젝트 루트에서 `vanilla/` 디렉터리를 삭제하여 프로젝트를 깔끔하게
정리합니다.
