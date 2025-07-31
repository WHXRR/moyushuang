import type {
  HistoryMessage,
  JoinRoomMessageType,
  SendMessage,
} from '@/types/chat'
import { Avatar } from '../../../components/Avatar'
import useStore from '@/store'
import { useEffect, useRef, useState } from 'react'
import { transformTextToEmojiHtml } from '@/utils/insertEmoji'

export function ChatBox(
  props: HistoryMessage | SendMessage | JoinRoomMessageType,
) {
  const { type } = props
  const { userInfo } = useStore()

  const boxRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.1,
      },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {type === 'joinRoom' && (
        <div className="text-center text-sm">{props.username}进入了房间</div>
      )}
      {(type === 'historyMessage' || type === 'sendMessage') && props.sender ? (
        <div
          ref={boxRef}
          className={`flex gap-2 items-start group ${isVisible ? 'show' : ''} ${
            props.sender?.id === userInfo.id
              ? 'flex-row-reverse message-box-right text-right'
              : 'message-box-left'
          }`}
        >
          {props.sender?.headPic && (
            <Avatar headPic={props.sender.headPic} className="w-7" />
          )}
          <div
            className={`flex flex-col ${props.sender?.id === userInfo.id ? 'items-end' : ''}`}
          >
            <div
              className={`flex gap-2 items-end text-xs leading-none pb-2 ${props.sender?.id === userInfo.id ? 'flex-row-reverse' : ''}`}
            >
              <div>{props.sender?.username}</div>
              <div className="text-[10px] leading-none text-gray-400 opacity-0 transition-all group-hover:opacity-100">
                {new Date(props.createTime).toLocaleString()}
              </div>
            </div>
            <div
              className="bg-[#ff9e97] px-2 py-1.5 rounded-lg max-w-max"
              dangerouslySetInnerHTML={{
                __html: transformTextToEmojiHtml(props.content),
              }}
            ></div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
