import Markdown from 'markdown-it'

function extract(md: Markdown) {
    const RE = /^<(script|style)(?=(\s|>|$))/i
    md.renderer.rules.html_block = (tokens, idx, _, env) => {
        const content = tokens[idx].content
        if (RE.test(content.trim())) {
            env.hoistedTags.push(content)
            return ''
        }
        return content
    }
}

function getMarkdown(options?: Markdown.Options, extend?: (md: Markdown) => void) {
    const md = new Markdown({ ...options, html: true })
    md.use(extract)
    if (typeof extend === 'function') extend(md)
    return md
}

export default function(input: string, options?: {
    markdown?: Markdown.Options
    extend?: (md: Markdown) => void
}) {
    const env: { hoistedTags: Array<string> } = { hoistedTags: [] }
    return `<template><div>${getMarkdown(options?.markdown, options?.extend).render(input, env)}</div></template>`
        + (env.hoistedTags ? env.hoistedTags.join('\n\n') : '')
}