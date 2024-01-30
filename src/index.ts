import convertMarkdown from './markdown';
import { Component } from 'vue'
import { defineSFC, File } from 'vue-sfc-component';

import Markdown from 'markdown-it-for-mdvc';

type MaybePromise<T> = T | Promise<T>
type FileContent = string | ArrayBuffer | Blob | Response

function ensureAsync(fn?: (...arg: any) => any) {
    if (!fn) return
    return async function(...arg: any) {
        const r = fn(...arg)
        if (r instanceof Promise) {
            return await r
        }
        return r
    }
}

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
) : Promise<Component> {

    options = options || {}
    options.fileConvertRule = ensureAsync(options.fileConvertRule)

    return defineSFC(mainfile, {
        ...options,
        async fileConvertRule(file: File) {
            if (file.filename.endsWith(".md") || file.filename.endsWith(".mdv")) {
                if (file.content instanceof URL) {
                    const res = await fetch(file.content)
                    file.content = await res.text()
                } else if (file.content instanceof ArrayBuffer) {
                    const decoder = new TextDecoder()
                    file.content = decoder.decode(file.content)
                } 
                file.content = convertMarkdown(file.content, {
                    markdown: options?.markdown,
                    extend: options?.extend
                })
                console.log(file.content)
                file.language = "vue"
            }
            if (options?.fileConvertRule) {
                await options.fileConvertRule(file)
            }
        }
    })
}