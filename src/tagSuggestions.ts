import { VueRenderer } from '@tiptap/vue-3'
import tippy, { Instance as TippyInstance } from 'tippy.js'

import TagList from './components/TagList.vue'
import { SuggestionOptions } from '@tiptap/suggestion'

const suggestions: Omit<SuggestionOptions, 'editor'> = {
  render () {
    let component: VueRenderer
    let popup: TippyInstance

    return {
      onStart (props) {
        component = new VueRenderer(TagList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          // using vue 3:
          props,
          editor: props.editor,
        })

        if (props.clientRect == null) {
          return
        }

        // @ts-ignore
        [popup] = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate (props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup.setProps({
          // @ts-ignore
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown (props) {
        if (props.event.key === 'Escape') {
          popup.hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup.destroy()
        component.destroy()
      },
    }
  },
}

export default suggestions
