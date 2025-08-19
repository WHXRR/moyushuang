import { addChatroom } from '@/interfaces/api'
import useStore from '@/store'
import type {
  ReceiveJoinRoomType,
  JoinRoomUserType,
  SendMessage,
} from '@/types/chat'
import type { UserInfo } from '@/types/user'
import type { MessageInstance } from 'antd/es/message/interface'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket(
  userInfo: UserInfo,
  chatroomId: number,
  message: MessageInstance,
) {
  if (socket) return socket

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 50,
  })

  const payload = {
    chatroomId: +chatroomId,
    userId: userInfo.id,
    username: userInfo.username,
  }

  socket.on('connect', async () => {
    try {
      const res = await addChatroom(chatroomId)
      if (res.data.code === 200) {
        message.success(res.data.message)
        socket?.emit('joinRoom', payload)
      }
      socket?.emit('userOnline', payload)
    } catch (e) {
      console.warn(e)
      window.location.href = '/home'
    }
  })

  socket.on('reconnect', () => {
    socket?.emit('userOnline', payload)
  })

  socket.on('joinRoom', (payload: ReceiveJoinRoomType) => {
    // 发送加入房间消息
    useStore.getState().updateMessageList({
      type: 'joinRoom',
      ...payload,
    })
    // 获取聊天室用户列表
    useStore.getState().updateChatroomUsers(payload.users)
  })

  socket.on('userOnline', (list: JoinRoomUserType[]) => {
    const ids = list.map((item) => item.userId)
    useStore.getState().updateOnlineUserIds(ids)
  })

  socket.on('userOffline', (list: JoinRoomUserType[]) => {
    const ids = list.map((item) => item.userId)
    useStore.getState().updateOnlineUserIds(ids)
  })

  socket.on('message', (message: SendMessage) => {
    useStore.getState().updateMessageList(message)
  })

  socket.on('chatroomClosed', () => {
    window.location.href = '/home'
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket(): Socket | null {
  return socket
}
