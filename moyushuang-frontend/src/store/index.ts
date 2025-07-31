import type { JoinRoomMessageType, SendMessage } from '@/types/chat'
import type { UserInfo } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  userInfo: UserInfo
  updateUserInfo: (data: UserInfo) => void
  clearUserInfo: () => void
  messageList: (SendMessage | JoinRoomMessageType)[]
  updateMessageList: (msg: SendMessage | JoinRoomMessageType) => void
  clearMessageList: () => void
  onlineUserIds: number[]
  updateOnlineUserIds: (data: number[]) => void
  chatroomUsers: UserInfo[]
  updateChatroomUsers: (data: UserInfo[]) => void
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userInfo: {
        username: '',
        headPic: 'baimao',
        createTime: '',
        email: '',
        id: 0,
        token: '',
        updateTime: '',
        role: 'user',
      },
      updateUserInfo: (data) => set({ userInfo: data }),
      clearUserInfo: () =>
        set({
          userInfo: {
            username: '',
            headPic: 'baimao',
            createTime: '',
            email: '',
            id: 0,
            token: '',
            updateTime: '',
            role: 'user',
          },
        }),
      messageList: [],
      updateMessageList: (msg: SendMessage | JoinRoomMessageType) =>
        set({
          messageList: [...get().messageList, msg],
        }),
      clearMessageList: () =>
        set({
          messageList: [],
        }),
      onlineUserIds: [],
      updateOnlineUserIds: (data: number[]) =>
        set({
          onlineUserIds: data,
        }),
      chatroomUsers: [],
      updateChatroomUsers: (data) => set({ chatroomUsers: data }),
    }),
    {
      name: 'moyushuang',
      partialize: (state) => ({ userInfo: state.userInfo }),
    },
  ),
)

export default useStore
