<!-- TODO: This component is the popup list that is rendered when the opening tag is entered -->
<!-- This uses tippy.js here, but we can use our own -->
<!-- The popup is rendered in the editor via the render method in tags.js -->
<!-- The render method is a config property passed to the extension config object -->
<!-- The extension config object is added in the extensions property of the Editor class in TextEdito.vue -->
<template>
    <div class="items">
        <template v-if="items.length">
            <button class="item" :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items"
                :key="index" @click="selectItem(index)">
                {{ item.display }}
            </button>
        </template>
        <div class="item" v-else>
            No result
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: { display: string }[]
  command: (x: { id: string }) => void
}>()

const selectedIndex = ref(0)

watch(() => props.items, () => {
  selectedIndex.value = 0
})

function onKeyDown ({ event }: { event: KeyboardEvent }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler () {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

function downHandler () {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler () {
  selectItem(selectedIndex.value)
}

function selectItem (index: number) {
  const item = props.items[index].display

  if (item) {
    props.command({ id: item })
  }
}
</script>

<style scoped>
.items {
    padding: 0.2rem;
    position: relative;
    border-radius: 0.5rem;
    background: #FFF;
    color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-size: 0.9rem;
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.05),
        0px 10px 20px rgba(0, 0, 0, 0.1),
    ;
}

.item {
    display: block;
    margin: 0;
    width: 100%;
    text-align: left;
    background: transparent;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    padding: 0.2rem 0.4rem;
}

.is-selected {
    background-color: bisque;
}
</style>
