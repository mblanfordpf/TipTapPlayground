<template>
    <text-editor v-model="content" :tags="tags" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from './TextEditor.vue'
import { baseMergeTags, flatten } from '../tags'

const content = ref('')

const tags = flatten(baseMergeTags)
</script>
