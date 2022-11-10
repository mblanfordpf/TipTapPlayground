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
