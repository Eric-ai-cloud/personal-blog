import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: { src: string; alt?: string; title?: string; width?: number; height?: number }) => ReturnType,
      /**
       * Update an image
       */
      updateImage: (options: { src: string; alt?: string; title?: string; width?: number; height?: number }) => ReturnType,
    }
  }
}

const ImageResize = Node.create({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.style.width || element.getAttribute('width')
          return width ? parseInt(width, 10) : null
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
            style: `width: ${attributes.width}px; max-width: 100%; height: auto; cursor: pointer;`,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.style.height || element.getAttribute('height')
          return height ? parseInt(height, 10) : null
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
            style: `height: ${attributes.height}px; width: auto; max-width: 100%; cursor: pointer;`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setImage: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
      updateImage: options => ({ commands }) => {
        return commands.updateAttributes(this.type, options)
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageResize'),
        props: {
          decorations: (state) => {
            const { doc } = state
            const decorations: Decoration[] = []

            doc.descendants((node, pos) => {
              if (node.type.name === 'image') {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const container = document.createElement('div')
                    container.className = 'image-resize-container'
                    container.style.position = 'relative'
                    container.style.display = 'inline-block'

                    const handleBR = document.createElement('div')
                    handleBR.className = 'image-resize-handle image-resize-handle-br'
                    handleBR.style.position = 'absolute'
                    handleBR.style.width = '12px'
                    handleBR.style.height = '12px'
                    handleBR.style.backgroundColor = '#3b82f6'
                    handleBR.style.borderRadius = '50%'
                    handleBR.style.bottom = '-6px'
                    handleBR.style.right = '-6px'
                    handleBR.style.cursor = 'nwse-resize'
                    handleBR.style.zIndex = '10'
                    handleBR.style.display = 'none'

                    const handleBL = document.createElement('div')
                    handleBL.className = 'image-resize-handle image-resize-handle-bl'
                    handleBL.style.position = 'absolute'
                    handleBL.style.width = '12px'
                    handleBL.style.height = '12px'
                    handleBL.style.backgroundColor = '#3b82f6'
                    handleBL.style.borderRadius = '50%'
                    handleBL.style.bottom = '-6px'
                    handleBL.style.left = '-6px'
                    handleBL.style.cursor = 'nesw-resize'
                    handleBL.style.zIndex = '10'
                    handleBL.style.display = 'none'

                    container.appendChild(handleBR)
                    container.appendChild(handleBL)

                    return container
                  })
                )
              }
            })

            return DecorationSet.create(doc, decorations)
          },
          handleDOMEvents: {
            mousedown: (view, event) => {
              const target = event.target as HTMLElement
              if (target.classList.contains('image-resize-handle')) {
                event.preventDefault()

                const brHandle = target.classList.contains('image-resize-handle-br')
                const blHandle = target.classList.contains('image-resize-handle-bl')

                if (!brHandle && !blHandle) return false

                const startPos = view.posAtDOM(target.parentElement!.parentElement!, 0)
                const node = view.state.doc.nodeAt(startPos)

                if (!node || node.type.name !== 'image') return false

                const startX = event.clientX
                const startY = event.clientY
                const startWidth = node.attrs.width || 200
                const startHeight = node.attrs.height || 150

                const onMouseMove = (moveEvent: MouseEvent) => {
                  const dx = moveEvent.clientX - startX
                  const dy = moveEvent.clientY - startY

                  let newWidth, newHeight

                  if (brHandle) {
                    newWidth = Math.max(100, startWidth + dx)
                    newHeight = Math.max(75, startHeight + dy)
                  } else {
                    newWidth = Math.max(100, startWidth - dx)
                    newHeight = Math.max(75, startHeight + dy)
                  }

                  const transaction = view.state.tr.setNodeAttribute(startPos, 'width', Math.round(newWidth))
                  view.dispatch(transaction)
                }

                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove)
                  document.removeEventListener('mouseup', onMouseUp)
                }

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)

                return true
              }

              return false
            },
            mouseover: (view, event) => {
              const target = event.target as HTMLElement
              if (target.tagName === 'IMG' && target.parentElement?.classList.contains('image-resize-container')) {
                const handles = target.parentElement.querySelectorAll('.image-resize-handle')
                handles.forEach(handle => {
                  (handle as HTMLElement).style.display = 'block'
                })
              }
              return false
            },
            mouseout: (view, event) => {
              const target = event.target as HTMLElement
              if (target.tagName === 'IMG' && target.parentElement?.classList.contains('image-resize-container')) {
                const relatedTarget = event.relatedTarget as HTMLElement
                if (!target.parentElement?.contains(relatedTarget)) {
                  const handles = target.parentElement.querySelectorAll('.image-resize-handle')
                  handles.forEach(handle => {
                    (handle as HTMLElement).style.display = 'none'
                  })
                }
              }
              return false
            }
          }
        }
      })
    ]
  }
})

export default ImageResize