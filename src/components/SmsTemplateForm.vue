<template>
    <text-editor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from './TextEditor.vue'

const content = ref('')
</script>
