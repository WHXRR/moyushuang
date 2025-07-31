import { Avatar } from '@/components/Avatar'
import './ChatroomMembers.css'
import useStore from '@/store'
import { Modal } from 'antd'
import { useState } from 'react'
import type { UserInfo } from '@/types/user'
import { getChatroomMembers } from '@/interfaces/api'
import { useParams } from 'react-router-dom'

const UserDisplay = (props: UserInfo) => {
  const { onlineUserIds, userInfo } = useStore()
  return (
    <div className="text-xs text-center" title={props.username}>
      <Avatar headPic={props.headPic} className="w-7 mx-auto" />
      <div className="pt-0.5 relative px-2">
        {onlineUserIds.includes(props.id) ? (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 mt-0.5 bg-green-500 rounded-full dot"></div>
        ) : (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 mt-0.5 bg-red-500 rounded-full"></div>
        )}
        <div className="overflow-hidden text-ellipsis flex-1 leading-none whitespace-nowrap text-[10px]">
          {props.id === userInfo.id && <span>(我)</span>}
          <span>{props.username}</span>
        </div>
      </div>
    </div>
  )
}

export function ChatroomMembers() {
  const { chatroomUsers } = useStore()

  const [members, setMembers] = useState<UserInfo[]>([])
  const getMembers = async (id: string) => {
    try {
      const res = await getChatroomMembers(+id)
      if (res.status === 200 || res.status === 201) {
        setMembers(res.data)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { id } = useParams()
  const showModal = () => {
    if (id) {
      getMembers(id)
      setIsModalOpen(true)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div
        className="grid grid-cols-4 gap-3 cursor-pointer"
        onClick={showModal}
      >
        {chatroomUsers.map((item) => {
          return <UserDisplay key={item.id} {...item} />
        })}
      </div>

      <Modal
        title="群聊用户"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 pt-4">
          {members.map((item) => {
            return <UserDisplay key={item.id} {...item} />
          })}
        </div>
      </Modal>
    </>
  )
}
