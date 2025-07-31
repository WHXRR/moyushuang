import { ChatBox } from '@/pages/Chatroom/components/ChatBox'
import { getHistoryMessage } from '@/interfaces/api'
import useStore from '@/store'
import type { HistoryMessage } from '@/types/chat'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export function ChatList() {
  const [historyMessageList, setHistoryMessageList] = useState<
    Array<HistoryMessage>
  >([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const getChatHistory = async () => {
    if (loading || !hasMore || !id) return
    setLoading(true)
    try {
      const res = await getHistoryMessage(+id, offset, 10)
      if (res.status === 200 || res.status === 201) {
        const newMessages = res.data.data.reverse() || []
        setHistoryMessageList((prev) => [...newMessages, ...prev])
        setOffset((prev) => prev + newMessages.length)
        if (!res.data.hasMore) {
          setHasMore(false)
        }
      }
    } catch (e) {
      console.warn('获取历史失败', e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getChatHistory()
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const [viewHistoryMsg, setViewHistoryMsg] = useState(false)
  const isScrollAtBottom = (el: HTMLElement): boolean => {
    return el.scrollHeight - el.scrollTop <= el.clientHeight
  }
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loading) {
        setViewHistoryMsg(true)
        const scrollHeightBefore = container.scrollHeight
        getChatHistory().then(() => {
          setTimeout(() => {
            const scrollHeightAfter = container.scrollHeight
            container.scrollTop = scrollHeightAfter - scrollHeightBefore
          }, 0)
        })
      } else if (isScrollAtBottom(container)) {
        setViewHistoryMsg(false)
        setHasNewMessageTips(false)
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, loading])

  const { messageList } = useStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    if (!viewHistoryMsg) {
      scrollToBottom()
    }
  }, [messageList, viewHistoryMsg, historyMessageList])

  const [hasNewMessageTips, setHasNewMessageTips] = useState(false)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!isScrollAtBottom(container)) {
      setHasNewMessageTips(true)
    }
  }, [messageList])

  return (
    <div className="space-y-4 h-full p-4 overflow-y-auto" ref={containerRef}>
      {historyMessageList.map((item) => (
        <ChatBox key={item.id} {...item} type="historyMessage" />
      ))}
      {messageList.map((item, index) => (
        <ChatBox key={index} {...item} />
      ))}
      <div ref={bottomRef} />
      {hasNewMessageTips && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 cursor-pointer flex items-center gap-1"
          onClick={scrollToBottom}
        >
          <div>有新消息</div>
          <svg
            className="w-4"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5514"
          >
            <path
              d="M528.85504 788.25856l357.52832-357.52832c9.30688-9.30944 9.30688-24.40064 0-33.7088-9.30816-9.30688-24.40064-9.30688-33.7088 0L512 737.696 171.32544 397.02144c-9.30688-9.30688-24.40064-9.30688-33.70752 0-4.65536 4.65536-6.98112 10.75328-6.98112 16.85376 0 6.10176 2.32576 12.19968 6.98112 16.85504l357.5296 357.52832C504.45568 797.56672 519.5456 797.56672 528.85504 788.25856zM595.06432 508.38016c-4.85504 0-9.71008-1.8432-13.42592-5.53472-7.46368-7.41376-7.50592-19.47648-0.09216-26.94272l200.74624-202.13248c7.41376-7.46624 19.47904-7.50592 26.94272-0.09344 7.46496 7.41376 7.5072 19.47776 0.09216 26.94272L608.58112 502.75328C604.8576 506.50112 599.96032 508.38016 595.06432 508.38016zM512 592.01664c-4.89856 0-9.79328-1.87776-13.51808-5.62688L214.67392 300.61952c-7.41376-7.46624-7.3728-19.52896 0.09344-26.94272 7.46624-7.41376 19.52768-7.37152 26.94272 0.09344l283.808 285.77024c7.41504 7.46624 7.3728 19.52896-0.09216 26.94272C521.7088 590.17216 516.85376 592.01664 512 592.01664z"
              p-id="5515"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}
