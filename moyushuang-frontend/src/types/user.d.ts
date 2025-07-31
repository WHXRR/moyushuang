import type { AvatarType } from '@/components/Avatar'

export interface LoginFormValue {
  email: string
  password: string
}

export interface RegisterUser {
  username: string
  email: string
  password: string
  confirmPassword: string
  captcha: string
}

export interface UpdatePassword {
  email: string
  password: string
  confirmPassword: string
  captcha: string
}

export interface UpdateUserInfoType {
  headPic: AvatarType
  username: string
}

export interface UserInfo {
  headPic: AvatarType
  username: string
  createTime: string
  email: string
  id: number
  token: string
  updateTime: string
  role: 'admin' | 'user'
}
