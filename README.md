# mdvc

mdvc (markdown-vue-component) is a library to compile markdown/vue/js/ts/css files to vue components directly in your browser.

## Installation

```bash
npm install mdvc
# or
yarn add mdvc
```

## Usage

```js

import { createApp, defineAsyncComponent } from 'vue'
import mdvc from 'mdvc';

const files = {
    'main.md': `

## Hello World!

\`\`\`js
console.log(123)
\`\`\`

<h1>{{ msg }}</h1>
<button @click="msg = msg.split('').reverse().join('')">
    Reverse
</button>

<script setup>
import './main.css'
import { ref } from 'vue'
const msg = ref("Hello World!")
</script>

<style scoped>
h1 {
    color: red;
}
</style>`,

    'main.css': `

@import url('./files/part.css') screen and (min-width: 500px);
h1 {
    text-decoration: underline;
}`,
    'files/part.css': `

h1 {
    text-align: center;
}`

}

createApp(defineAsyncComponent(() => mdvc('main.md', { files }))).mount('#app')

```

## Definiton

```ts
import { Component } from 'vue'
import { File } from 'vue-sfc-component';

type MaybePromise<T> = T | Promise<T>
type FileContent = string | ArrayBuffer | Blob | Response

export default async function(
    mainfile: string,
    options?: {
        imports?: Record<string, any>;
        files?: Record<string, FileContent | URL>;
        getFile?: (path: string) => MaybePromise<FileContent | URL>;
        renderStyles?: (css: string) => MaybePromise<string>;
        catch?: (errors: Array<string | Error>) => MaybePromise<void>;
        fileConvertRule?: (file: File) => MaybePromise<void>;
        markdown?: Markdown.Options;
        extend?: (md: Markdown) => void;
    }
) : Promise<Component>
```

## Options

### 1. `markdown`

`markdown-it` options

### 2. `extend`

You can extend `markdown-it` by passing a function to `extend` option.

```js
import mdvc from 'mdvc';
import katex from 'markdown-it-katex'

mdvc('main.md', {
    extend(md) {
        md.use(katex)
    },
    // ...
})
```

Other options are the same as [vue-sfc-component](https://github.com/YouXam/vue-sfc-component) options.

## License

[MIT](LICENSE)