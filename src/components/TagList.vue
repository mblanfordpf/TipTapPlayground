<!-- TODO: This component is the popup list that is rendered when the opening tag is entered -->
<!--  This is rendered in the editor via the render method in tags.js -->
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

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },

        command: {
            type: Function,
            required: true,
        },
    },
    data () {
        return {
            selectedIndex: 0,
        }
    },
    watch: {
        items () {
            this.selectedIndex = 0
        },
    },
    methods: {
        onKeyDown ({ event }) {
            if (event.key === 'ArrowUp') {
                this.upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                this.downHandler()
                return true
            }

            if (event.key === 'Enter') {
                this.enterHandler()
                return true
            }

            return false
        },
        upHandler () {
            this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
        },
        downHandler () {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length
        },
        enterHandler () {
            this.selectItem(this.selectedIndex)
        },
        selectItem (index) {
            const item = this.items[index].display

            if (item) {
                this.command({ id: item })
            }
        },
    },
}
</script>

<style>
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