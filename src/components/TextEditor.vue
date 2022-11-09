<template>
    <div v-if="editor">
        <button @click.prevent="showMergeTagMenu = !showMergeTagMenu"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            Merge Tags
        </button>
        <div v-if="showMergeTagMenu">
            <button v-for="tag, i in tags" :key="i"  @click.prevent="insertMergeTag(tag.display)">
                {{ tag.display }}
            </button>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
// import { Mention } from '../extension-mergetag/mergeTag.ts'
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
            tags: null,
            showMergeTagMenu: false
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
                            return this.tags.filter(item => item.display.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
                        },
                        char: '{{',
                        allowedPrefixes: [' '],
                        ...tags // Just the render() function - could we use our own component instead of the tippy popup?
                        // TODO: further config
                    }
                }),
                Placeholder.configure({
                    placeholder: 'Enter some text!'
                })
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
                {
                    value: 'tag1',
                    display: 'Tag 1'
                },
                {
                    value: 'tag2',
                    display: 'Tag 2'
                },
                {
                    value: 'tag3',
                    display: 'Tag 3'
                },
                {
                    value: 'tag4',
                    display: 'Tag 4'
                },
                {
                    value: 'tag5',
                    display: 'Tag 5'
                }
            ]
        },
        openMergeTagMenu () {
            console.log('Show merge tag menu')
            // TODO: Create a merge tag menu component
        },
        insertMergeTag (selectedTag) {
            this.editor.commands.insertContent(
                `<span data-type="mention" class="mention" data-id="${selectedTag}" contenteditable="false">{{ ${selectedTag} }}</span>`
            )
        }
    }
}
</script>

<style>
.mention {
    border: 1px solid #adb5bd;
    border-radius: 8px;
    padding: 4px 6px;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: #adb5bd;
    pointer-events: none;
}
</style>