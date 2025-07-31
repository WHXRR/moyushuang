import { Container } from './Container'
import { Header } from './Header'
import { Config } from './Config'
import { useEffect, useState } from 'react'
import useStore from '@/store'
import { getChatroomInfo } from '@/interfaces/api'
import { ChatroomContext } from '@/context/ChatroomContext'
import type { ChatroomInfo } from '@/types/chat'
import { disconnectSocket, initSocket } from '@/utils/socketClient'
import { useParams } from 'react-router-dom'
import { App } from 'antd'

export default function Chatroom() {
  const { userInfo, updateChatroomUsers } = useStore()
  const { message } = App.useApp()

  const [chatroomInfo, setChatroomInfo] = useState<ChatroomInfo | null>(null)
  const getRoomInfo = async (id: string) => {
    try {
      const res = await getChatroomInfo(+id)
      if (res.status === 201 || res.status === 200) {
        setChatroomInfo(res.data)
        updateChatroomUsers(res.data.users)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      initSocket(userInfo, +id, message)
      getRoomInfo(id)
    }
    return () => {
      disconnectSocket()
    }
  }, [])

  return (
    <ChatroomContext value={chatroomInfo}>
      <div className="h-full flex flex-col">
        <div className="border-b border-gray-200 px-2">
          <Header />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1">
            <Container />
          </div>
          <div className="w-[270px] p-2 hidden md:block border-l border-gray-200">
            <Config />
          </div>
        </div>
      </div>
    </ChatroomContext>
  )
}
