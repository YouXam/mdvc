

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

export default {
    files
}
