<template>
    <text-editor v-model="content" />
</template>

<script>
import TextEditor from './TextEditor.vue'

export default {
    components: {
        TextEditor
    },
    data () {
        return {
            content: ''
        }
    }
}
</script>

<style>
.ProseMirror {
    border: 2px lightgrey solid;
    border-radius: 8px;
    width: 50%;
    height: 40vh;
    margin: auto;
    font-family: Arial, Helvetica, sans-serif
}
</style>