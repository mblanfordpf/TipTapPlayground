<template>
    <editor-content :editor="editor" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
// import Mention from '@tiptap/extension-mention'
import { Mention } from '../extension-mergetag/index.ts'
import { Editor, EditorContent } from '@tiptap/vue-3'
import tags from '../tags'

export default {
    components: {
        EditorContent,
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data () {
        return {
            editor: null,
            tags: null
        }
    },
    watch: {
        modelValue (value) {
            const isSame = this.editor.getHTML() === value

            if (isSame) {
                return
            }

            this.editor.commands.setContent(value, false)
        },
    },
    mounted () {
        this.fetchMergeTags()
        this.editor = new Editor({
            extensions: [
                StarterKit,
                Mention.configure({
                    HTMLAttributes: {
                        class: 'mention',
                    },
                    suggestion: {
                        items: ({ query }) => {
                            return this.tags.filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
                        },
                        char: '{{',
                        allowedPrefixes: [' '],
                        ...tags // Just the render() function - could we use our own component instead of the tippy popup?
                        // TODO: further config
                    }
                }),
            ],
            content: this.modelValue,
            onUpdate: () => {
                this.$emit('update:modelValue', this.editor.getHTML())
            },
        })
    },
    beforeUnmount () {
        this.editor.destroy()
    },
    methods: {
        fetchMergeTags () {
            this.tags = [
                'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
            ]
        }
    }
}
</script>

<style>
.mention {
    border: 1px solid #000;
    border-radius: 0.4rem;
    padding: 0.1rem 0.3rem;
    box-decoration-break: clone;
}
</style>