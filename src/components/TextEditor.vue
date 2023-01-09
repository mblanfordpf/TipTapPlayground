<template>
    <div v-if="editor">
        <button @click.prevent="openMergeTagMenu"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            Merge Tags
        </button>
        <div v-if="showMergeTagMenu">
            <button v-for="(tag, i) in tags" :key="i" @click.prevent="insertMergeTag(tag)">
                {{ tag.display }}
            </button>
        </div>
        <editor-content v-if="editor" :editor="editorInt" />
    </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import MergeTag from '../extension-mergetag'
import { Editor, EditorContent } from '@tiptap/vue-3'
import tagSuggestions from '../tagSuggestions'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

interface Tag {
  value: string
  display: string
}

const editor = ref<Editor|null>(null)
const editorInt = computed<any>(() => editor.value)

const showMergeTagMenu = ref(false)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      MergeTag.configure({
        HTMLAttributes: {
          class: 'merge-tag',
        },
        suggestion: {
          items: ({ query }) => {
            return props.tags.filter(item => item.display.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
          },
          ...tagSuggestions // Just the render() function - could we use our own component instead of the tippy popup?
        }
      }),
      Placeholder.configure({
        placeholder: 'Enter some text!'
      })
    ],
    content: props.modelValue,
    onUpdate: () => {
      console.log(editor.value?.getText())
      emit('update:modelValue', editor.value?.getHTML() ?? '')
    },
  })
})

onUnmounted(() => {
  editor.value?.destroy()
})

function openMergeTagMenu () {
  showMergeTagMenu.value = !showMergeTagMenu.value
  // TODO: Create a merge tag menu component
}

function insertMergeTag ({ value, display }: Tag) {
  editor.value?.commands.insertContent(
    `<span data-type="merge-tag" class="merge-tag" data-id="${value}" contenteditable="false">{{ ${display} }}</span>`
  )
}

</script>

<style>
.merge-tag {
    background: #dcf6ff;
    border-radius: 8px;
    padding: 4px 6px;
}

.ProseMirror {
    border: 2px lightgrey solid;
    border-radius: 8px;
    width: 50vw;
    height: 40vh;
    margin: auto;
    font-family: Arial, Helvetica, sans-serif;
    color: #8c91f3;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: #adb5bd;
    pointer-events: none;
}
</style>
