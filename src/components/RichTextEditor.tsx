import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import React, { useState, useCallback } from 'react'
import '../styles/editor.css';

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
}

interface MentionItem {
  id: string
  name: string
}

interface MentionNodeAttrs {
  id: string
  label: string
}

interface KeyDownHandlerProps {
  event: KeyboardEvent
  command: (attrs: { id: string; label: string }) => void
}

interface MentionSuggestionProps extends SuggestionProps {
  items: MentionItem[]
  command: (attrs: { id: string; label: string }) => void
}

const lowlight = createLowlight(common)

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, readOnly = false }) => {
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 })
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'task-item',
        },
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full mx-auto my-4',
        },
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            const users: MentionItem[] = [
              { id: '1', name: 'John Doe' },
              { id: '2', name: 'Jane Smith' },
              { id: '3', name: 'Bob Johnson' },
            ]
            return users
              .filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5)
          },
          render: () => {
            let popup: HTMLElement | null = null
            let selectedIndex = 0
            let currentItems: MentionItem[] = []

            const selectItem = (index: number) => {
              const items = popup?.querySelectorAll('div[data-index]')
              if (!items) return

              items.forEach((item, i) => {
                if (i === index) {
                  item.classList.add('bg-light-accent', 'dark:bg-dark-accent')
                } else {
                  item.classList.remove('bg-light-accent', 'dark:bg-dark-accent')
                }
              })
              selectedIndex = index
            }

            return {
              onStart: (props: SuggestionProps) => {
                popup = document.createElement('div')
                popup.className = 'bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-light-border dark:border-dark-border p-2 z-50'
                document.body.appendChild(popup)
                return popup
              },

              onUpdate: (props: SuggestionProps) => {
                if (!popup) return

                currentItems = props.items
                
                popup.innerHTML = props.items
                  .map((item, index) => 
                    `<div 
                      class="px-3 py-1 cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent rounded transition-colors ${index === selectedIndex ? 'bg-light-accent dark:bg-dark-accent' : ''}" 
                      data-index="${index}"
                    >
                      ${item.name}
                    </div>`
                  )
                  .join('')

                const rect = props.clientRect?.()
                if (rect) {
                  popup.style.position = 'absolute'
                  popup.style.left = `${rect.left}px`
                  popup.style.top = `${rect.top + 24}px`
                }

                // Add click handlers
                popup.querySelectorAll('div[data-index]').forEach((element) => {
                  element.addEventListener('click', () => {
                    const index = parseInt(element.getAttribute('data-index') || '0')
                    const item = props.items[index]
                    if (item) {
                      props.command({ id: item.id, label: item.name })
                    }
                  })
                })
              },

              onKeyDown: ({ event }: SuggestionKeyDownProps) => {
                if (!popup) return false

                const items = popup.querySelectorAll('div[data-index]')
                
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  selectedIndex = (selectedIndex + 1) % items.length
                  selectItem(selectedIndex)
                  return true
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  selectedIndex = (selectedIndex - 1 + items.length) % items.length
                  selectItem(selectedIndex)
                  return true
                }

                if (event.key === 'Enter' && currentItems[selectedIndex]) {
                  event.preventDefault()
                  const item = currentItems[selectedIndex]
                  return true
                }

                return false
              },

              onEnter: (props: SuggestionProps) => {
                const item = currentItems[selectedIndex]
                if (item) {
                  props.command({ id: item.id, label: item.name })
                }
                return true
              },

              onExit: () => {
                if (popup) {
                  popup.remove()
                  popup = null
                }
                currentItems = []
                selectedIndex = 0
              },
            }
          },
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      const text = editor.state.doc.textContent
      setWordCount({
        words: text.split(/\s+/).filter(word => word.length > 0).length,
        characters: text.length,
      })
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    if (imageUrl) {
      editor?.commands.setImage({ src: imageUrl });
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const MenuButton = ({ 
    onClick, 
    isActive = false,
    title,
    children 
  }: { 
    onClick: () => void, 
    isActive?: boolean,
    title: string,
    children: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-light-accent dark:bg-dark-accent text-primary'
          : 'hover:bg-light-accent dark:hover:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
      }`}
      title={title}
    >
      {children}
    </button>
  )

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSetLink = () => {
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setLinkUrl('')
      setShowLinkInput(false)
    } else {
      setShowLinkInput(true)
    }
  }

  return (
    <div className="border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface">
      <div className="border-b border-light-border dark:border-dark-border p-1 flex flex-wrap gap-1">
        {/* Text Style */}
        <div className="flex items-center gap-1 border-r border-light-border dark:border-dark-border pr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <span className="font-bold text-base">H1</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <span className="font-bold text-base">H2</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <span className="font-bold text-base">H3</span>
          </MenuButton>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-light-border dark:border-dark-border pr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m4-4l-4-4" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m4-4l-4-4" />
            </svg>
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-light-border dark:border-dark-border pr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </MenuButton>
        </div>

        {/* Block Formatting */}
        <div className="flex items-center gap-1 border-r border-light-border dark:border-dark-border pr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10.5h4m-4 3h4m-9-3h1m0 3h1m16-3h1m0 3h1M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </MenuButton>
        </div>

        {/* Advanced Features */}
        <div className="flex items-center gap-1 border-r border-light-border dark:border-dark-border pr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={handleImageUpload}
            title="Insert Image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => setShowImageInput(true)}
            title="Insert Image URL"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={handleSetLink}
            isActive={editor.isActive('link')}
            title="Insert Link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </MenuButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </MenuButton>
        </div>
      </div>
      
      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b border-light-border dark:border-dark-border p-2 flex gap-2">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 rounded border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary"
          />
          <button
            onClick={handleSetLink}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Add Link
          </button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Insert Image</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="px-2 py-1 border rounded bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addImage();
                  }
                }}
              />
              <button
                onClick={addImage}
                className="px-3 py-1 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="px-3 py-1 bg-light-border dark:bg-dark-border rounded hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Word Count */}
      <div className="border-t border-light-border dark:border-dark-border p-2 text-sm text-light-text-muted dark:text-dark-text-muted">
        {wordCount.words} words | {wordCount.characters} characters
      </div>
    </div>
  )
}

export default RichTextEditor
