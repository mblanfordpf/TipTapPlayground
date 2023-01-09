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
                <template v-for="menu in item.menu">{{ menu }} <span class="crumb">&gt;</span> </template>
                {{ item.name }}
            </button>
        </template>
        <div class="item" v-else>
            No result
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { FlatTag } from '../tags'

const props = defineProps<{
  items: FlatTag[]
  command: (x: { id: string }) => void
}>()

const selectedIndex = ref(0)

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})

watch(() => props.items, () => {
  selectedIndex.value = 0
})

function onKeyDown (event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      moveItemSelection(-1)
      break

    case 'ArrowDown':
      moveItemSelection(1)
      break

    case 'Enter':
      selectItem(selectedIndex.value)
      break

    default:
      return
  }

  event.preventDefault()
}

function moveItemSelection (by: number): void {
  selectedIndex.value = (selectedIndex.value + props.items.length + by) % props.items.length
}

function selectItem (index: number) {
  const item = props.items[index].name

  if (item) {
    props.command({ id: item })
  }
}
</script>

<style scoped>
.items {
  max-height: 10rem;
  overflow: auto;
    position: relative;
    border-radius: 0.5rem;
    background: #2c3e50;
    color: rgba(0, 0, 0, 0.8);
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

.crumb {
  color: #adb5bd;
}
</style>
