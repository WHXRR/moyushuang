import { ChatHistory } from 'generated/prisma';

export type HistoryDto = Pick<
  ChatHistory,
  'chatroomId' | 'userId' | 'type' | 'content'
>;

export interface HistoryMessageDto {
  sender: {
    id: number;
    createTime: Date;
    username: string;
    email: string;
    headPic: string;
  } | null;
  id: number;
  content: string;
  type: number;
  chatroomId: number;
  userId: number;
  createTime: Date;
  updateTime: Date;
}

export interface SendMessage {
  content: string;
  type: number;
  createTime: Date;
  sender: {
    id: number;
    createTime: Date;
    username: string;
    email: string;
    headPic: string;
  } | null;
}
