import { createApp, defineAsyncComponent } from 'vue'
import mdvc from '../src/index';


import options from './files';

createApp(defineAsyncComponent(() => mdvc('main.md', options))).mount('#app')