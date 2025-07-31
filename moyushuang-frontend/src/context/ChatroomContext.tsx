import type { ChatroomInfo } from '@/types/chat'
import { createContext } from 'react'

export const ChatroomContext = createContext<ChatroomInfo | null>(null)
