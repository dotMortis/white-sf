import { render } from 'preact';
import { App } from './app.js';
import './index.css';

export const ServerUrl = 'http://localhost:3000';

render(<App />, document.getElementById('app')!);
