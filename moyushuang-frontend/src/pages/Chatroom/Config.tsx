import { ChatroomMembers } from '@/pages/Chatroom/components/ChatroomMembers'

export function Config() {
  return (
    <div>
      <ChatroomMembers />
      <div className="bg-yellow-100 rounded-md p-2 mt-4">
        文明发言，维护绿色上网环境噢!
      </div>
    </div>
  )
}
