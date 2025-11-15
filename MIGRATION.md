# Vanilla to Svelte 5 Migration Guide

This document describes the process of migrating the pure JavaScript Pomodoro
timer web application located in the `vanilla/` directory into the Svelte 5
project at the repository root.

The goal of this migration is to preserve the existing behavior and user
experience while rewriting the implementation using Svelte 5 runes and idiomatic
Svelte patterns.

---

## 2. Migration Steps

### Step 1: Copy UI Markup and Styles

#### HTML Markup

- Copy every `<section>` element located **inside the `<main>` tag** of
  `vanilla/index.html`.
- Paste them into the `<main>` tag of `src/App.svelte`.

#### CSS Styles

- Copy the entire contents of `vanilla/src/css/style.css`.
- Paste them into `src/app.css`, **below the Tailwind directives**.

---

### Step 2: Migrate Core Logic (Using Svelte 5 Runes)

Move the core logic from `vanilla/src/js/main.js` into the `<script lang="ts">`
block of `src/App.svelte` and rewrite it using Svelte 5 conventions.

#### 1. Define State

- Convert all global variables from `main.js` (e.g. `timer`, `remainingTime`,
  `status`, etc.) into **reactive state using the `$state` rune** inside
  `App.svelte`.

#### 2. Remove Direct DOM Manipulation

Remove all direct DOM manipulation such as:

- `document.getElementById`
- `querySelector` / `querySelectorAll`
- Any use of `classList.add` / `classList.remove`
- Manual `addEventListener` calls

Replace them with Svelte features:

- Conditional rendering: `{#if ...}{/if}`
- Class directives: `class:name={condition}`
- Data binding: `bind:value`
- Svelte-style events: `on:click={...}`, `on:submit={...}`

The UI must update reactively based on Svelte state, not through manual DOM
updates.

---

### Step 3: Integrate and Refactor Utility Logic

Move utility modules from `vanilla/src/js/` (such as `timer.js`, `notify.js`,
`worker.js`, `util.js`) either into Svelte or into dedicated TypeScript modules
under `src/lib/`.

#### Timer & Worker Logic (`timer.js`, `worker.js`)

- Reimplement the core timer logic using Svelte’s lifecycle runes (such as
  `$effect`) and reactive state.
- If Web Workers are still required, move the worker file into the `public/`
  directory and call it from Svelte.
- Alternatively, consider replacing the worker-based logic with Svelte stores if
  the performance characteristics allow it.

#### Notification Logic (`notify.js`)

- Convert all Notification API logic into functions or methods inside
  `App.svelte`.
- Invoke these only when needed (for example, when the timer finishes).

#### Utility Functions (`util.js`)

- Move reusable helper functions into a new file such as `src/lib/utils.ts`.
- Export them from `src/lib/utils.ts` and import them where needed in Svelte
  components.

---

### Step 4 (Optional): Refactor into Components

If `App.svelte` becomes too large, split the UI into smaller components based on
responsibility for better readability and maintainability.

Suggested component boundaries:

- `TimerDisplay.svelte`: Displays the remaining time.
- `TimerControls.svelte`: Contains the start, pause, and reset buttons.
- `SettingsModal.svelte`: A modal for configuring timer settings.

Each component should receive only the props it needs and emit events (or call
passed-in callbacks) for user interactions.

---

### Step 5: Final Cleanup

After verifying that the Svelte 5 version behaves the same as the original
`vanilla/` version:

- Remove the entire `vanilla/` directory from the project root to clean up the
  repository.
- Make sure that any remaining references to the old paths are removed from
  build scripts or documentation.

---

## 3. Short AI Checklist (for code assistants like Claude)

When using an AI code assistant (e.g. Claude, ChatGPT) to apply this migration,
make sure it follows these rules:

- [ ] **Respect the scope**: This is a migration, not a redesign. Preserve the
      existing behavior and UI as much as possible.
- [ ] **Follow the steps** in this document (markup → styles → core logic →
      utilities → optional refactor) instead of doing everything at once.
- [ ] **Split work into commit-sized steps**:\
      Treat each numbered step (and each sub-task within it) as a logical unit
      of work that could become its own commit\
      (e.g. “Copy markup”, “Move styles”, “Migrate timer logic”, “Integrate
      utilities”, “Refactor components”).
- [ ] **Propose commit messages per step**:\
      At the end of each step, suggest a Git commit message (subject line and,
      if useful, a short body) that could be used if this step were committed
      separately. Keep a short “Suggested commits” list as you go.
- [ ] **Avoid large, monolithic edits**:\
      Only modify the files required for the current step; do not preemptively
      change unrelated code.
- [ ] **Do not use direct DOM APIs** inside Svelte files\
      (`document.getElementById`, `querySelector`, `classList`, manual
      `addEventListener`, etc.).
- [ ] **Use Svelte 5 runes and idioms**:\
      Use `$state` for reactive state, `$effect` for reacting to state changes,
      Svelte event handlers (`on:click`), bindings (`bind:value`), and class
      directives (`class:name={condition}`).
- [ ] **Keep file boundaries clear**:\
      - Main logic in `src/App.svelte`\
      - Reusable helpers in `src/lib/*.ts`\
      - Worker files in `public/` (if still required)
- [ ] **Explain before you change**:\
      Provide a brief plan (3–5 bullet points) before showing any updated code
      or diffs.
- [ ] **TypeScript-friendly code**:\
      Prefer explicit types where clarity improves maintainability (for example,
      for timer state or status values).
- [ ] **No silent behavior changes**:\
      Do not alter timings, text, defaults, or UX patterns unless explicitly
      requested.
