<template>
  <div id="app">
    <sms-template-form />
  </div>
</template>

<script>
import SmsTemplateForm from './components/SmsTemplateForm.vue'

export default {
  name: 'App',
  components: {
    SmsTemplateForm
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
