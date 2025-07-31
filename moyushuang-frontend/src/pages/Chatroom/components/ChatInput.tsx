import useStore from '@/store'
import type { SendMessagePayload } from '@/types/chat'
import { getSocket } from '@/utils/socketClient'
import { useCallback, useEffect, useRef } from 'react'
import ChatEmoji from './ChatEmoji'
import { insertEmoji, transformEmojiHtmlToText } from '@/utils/insertEmoji'
import { useParams } from 'react-router-dom'

export function ChatInput() {
  const { userInfo } = useStore()
  const socket = getSocket()
  const inputRef = useRef<HTMLDivElement>(null)
  const { id } = useParams()
  const sendMessage = () => {
    if (!inputRef.current) return
    const html = inputRef.current.innerHTML
    const text = transformEmojiHtmlToText(html).trim()
    if (!text || !id) return

    const payload: SendMessagePayload = {
      userId: userInfo.id,
      chatroomId: +id,
      message: {
        type: 'text',
        content: text,
      },
    }
    socket?.emit('sendMessage', payload)
    inputRef.current.innerHTML = ''
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return
      e.preventDefault()
      sendMessage()
    }
  }

  // 处理光标
  const savedRange = useRef<Range | null>(null)
  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0).cloneRange()
    }
  }
  // 插入表情
  const handleSelectEmoji = useCallback(
    (emoji: { name: string; src: string }) => {
      if (savedRange.current && inputRef.current) {
        insertEmoji(emoji, savedRange.current, inputRef.current)
      }
    },
    [savedRange],
  )

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="flex pb-2">
        <ChatEmoji onSelectEmoji={handleSelectEmoji} />
      </div>
      <div
        ref={inputRef}
        contentEditable
        className="flex-1 outline-none"
        onClick={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onKeyDown={handleKeyDown}
      ></div>
    </div>
  )
}
