import { mount } from 'svelte';
import 'normalize.css';
import '@noonnu/bmjua';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
