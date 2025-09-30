import {
  type HTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react'

import Quill, { Delta, type EmitterSource, Range } from 'quill'

export interface ReactQuillProps extends HTMLAttributes<HTMLDivElement> {
  readOnly?: boolean
  value: string
  modules?: Record<string, unknown>
  theme?: string
  onValueChange?: (value: string) => void
  onTextChange?: (delta: Delta, oldDelta: Delta, source: EmitterSource) => void
  onSelectionChange?: (range: Range | null, oldRange: Range | null, source: EmitterSource) => void
}
const QuillEditor = forwardRef<{ getQuill: () => Quill | null }, ReactQuillProps>(
  (
    { readOnly, value, onTextChange, onValueChange, onSelectionChange, theme, modules, ...props },
    ref
  ) => {
    const quillRef = useRef<Quill | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const onTextChangeRef = useRef(onTextChange)
    const onValueChangeRef = useRef(onValueChange)
    const valueRef = useRef(value)
    const onSelectionChangeRef = useRef(onSelectionChange)

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onValueChangeRef.current = onValueChange
      onSelectionChangeRef.current = onSelectionChange
      valueRef.current = value
    })

    useImperativeHandle(
      ref,
      () => ({
        getQuill: () => quillRef.current
      }),
      []
    )

    useEffect(() => {
      quillRef.current?.enable(!readOnly)
    }, [ref, readOnly])

    useEffect(() => {
      const container = containerRef.current!
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('article')
      )
      const quill = new Quill(editorContainer, {
        theme,
        modules
      })

      quillRef.current = quill
      quill.root.innerHTML = valueRef.current

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        const innerHTML = quill.root.innerHTML
        onTextChangeRef.current?.(...args)
        onValueChangeRef.current?.(innerHTML)
      })

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args)
      })

      return () => {
        quillRef.current = null
        container.innerHTML = ''
      }
    }, [ref, theme, modules])

    useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        const selection = quillRef.current.getSelection()
        quillRef.current.root.innerHTML = value
        if (selection) {
          quillRef.current.setSelection(selection)
        }
      }
    }, [value])

    return (
      <section
        ref={containerRef}
        {...props}
      ></section>
    )
  }
)

QuillEditor.displayName = 'Editor'

export default QuillEditor
