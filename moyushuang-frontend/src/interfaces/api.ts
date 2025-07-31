import type {
  LoginFormValue,
  RegisterUser,
  UpdatePassword,
  UpdateUserInfoType,
} from '@/types/user'
import { axiosInstance } from '.'

export async function login(loginUser: LoginFormValue) {
  return await axiosInstance.post('/user/login', loginUser)
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get('/user/register-captcha', {
    params: {
      email,
    },
  })
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/register', registerUser)
}

export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get('/user/update-password/captcha', {
    params: {
      email,
    },
  })
}

export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post('/user/update-password', data)
}

export async function getUserInfo() {
  return await axiosInstance.get('/user/info')
}

export async function updateInfo(data: UpdateUserInfoType) {
  return await axiosInstance.post('/user/update', data)
}

export async function getHistoryMessage(
  chatroomId: number,
  offset: number,
  limit: number,
) {
  return await axiosInstance.get('/chat-history/list', {
    params: {
      chatroomId,
      offset,
      limit,
    },
  })
}

export async function getChatroomInfo(chatroomId: number) {
  return await axiosInstance.get(`/chatroom/info/${chatroomId}`)
}

export async function getChatroomMembers(chatroomId: number, limit?: number) {
  return await axiosInstance.get(`/chatroom/members`, {
    params: {
      chatroomId,
      limit,
    },
  })
}

export async function addChatroom(chatroomId: number) {
  return await axiosInstance.get(`/chatroom/join`, {
    params: { chatroomId },
  })
}

export async function getJoinedChatroomList(name?: string) {
  return await axiosInstance.get('/chatroom/joined-list', {
    params: {
      name,
    },
  })
}

export async function getNotJoinedChatroomList(name?: string) {
  return await axiosInstance.get('/chatroom/not-joined-list', {
    params: {
      name,
    },
  })
}

export async function getChatroomList(name?: string) {
  return await axiosInstance.get('/chatroom/list', {
    params: {
      name,
    },
  })
}

export async function createGroup(name: string) {
  return await axiosInstance.get('/chatroom/create', {
    params: { name },
  })
}

export async function updateGroup(chatroomId: number, name: string) {
  return await axiosInstance.put(`/chatroom/${chatroomId}`, { name })
}

export async function delGroup(chatroomId: number) {
  return await axiosInstance.delete(`/chatroom/${chatroomId}`)
}
