<template>
    <text-editor v-model="content" :tags="baseMergeTags" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from './TextEditor.vue'

const content = ref('')

const baseMergeTags = [
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
  },
]
</script>
