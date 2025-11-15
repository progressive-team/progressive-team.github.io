<script lang="ts">
  import { showSettingModal } from '../stores/visibilityStore.svelte';
</script>

<section>
  <button
    id="create-timer"
    onclick={showSettingModal}
    aria-label="타이머 생성 버튼"
  >
    <svg viewBox="0 0 72 72" fill="none">
      <path
        d="M33 39H15V33H33V15H39V33H57V39H39V57H33V39Z"
        fill="currentColor"
      />
    </svg>
  </button>
  <label for="create-timer">클릭해서 타이머를 추가하세요</label>
</section>

<style>
</style>
