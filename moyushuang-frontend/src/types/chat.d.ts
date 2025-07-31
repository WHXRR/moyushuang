import type { AvatarType } from '@/components/Avatar'
import type { UserInfo } from './user'

export interface JoinRoomPayload {
  chatroomId: number
  userId: number
}

export interface SendMessagePayload {
  userId: number
  chatroomId: number
  message: Message
}

export interface Message {
  type: 'text' | 'image'
  content: string
}

export interface HistoryMessage {
  type: 'historyMessage'
  id: number
  content: string
  type: number
  chatroomId: number
  userId: number
  createTime: Date
  updateTime: Date
  sender?: {
    id: number
    createTime: Date
    username: string
    email: string
    headPic: AvatarType
  }
}

export interface SendMessage {
  type: 'sendMessage'
  content: string
  createTime: Date
  sender?: {
    id: number
    createTime: Date
    username: string
    email: string
    headPic: AvatarType
  }
}

export interface JoinRoomUserType {
  chatroomId: number
  userId: number
  username: string
}

export interface JoinRoomMessageType {
  type: 'joinRoom'
  chatroomId: number
  userId: number
  username: string
}

export interface ReceiveJoinRoomType {
  chatroomId: number
  userId: number
  username: string
  users: UserInfo[]
}

export interface ChatroomInfo {
  createTime: Date
  id: number
  name: string
  updateTime: Date
  users: UserInfo[]
}

export interface Chatroom {
  createTime: Date
  id: number
  name: string
  updateTime: Date
  userCount: number
  delGroup: () => void
  updateChatroom: () => void
}
