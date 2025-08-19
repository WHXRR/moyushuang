import { getChatroomStatus } from '@/interfaces/api'
import useStore from '@/store'
import { memo, useEffect } from 'react'

export const UnderMaintenance = memo(() => {
  const { chatroomStatus, updateChatroomStatus } = useStore()
  useEffect(() => {
    getChatroomStatus().then((res) => {
      updateChatroomStatus({
        isOpen: res.data.isOpen,
        closeTime: res.data.closeTime,
        status: res.data.status,
      })
    })
  }, [])

  return (
    <div>
      {!chatroomStatus.isOpen && (
        <div className="fixed top-0 left-0 z-30 w-screen h-screen bg-slate-800/40 flex items-center justify-center text-center text-white p-4">
          <div>
            <h1 className="text-4xl font-bold pb-4">维护中</h1>
            <p className="text-lg">
              主包上班时间早九晚六，下班后要打游戏，所以工作日的09:00 -
              18:00开放，其他时间就不开放啦，咱们下个工作日再见！
            </p>
          </div>
        </div>
      )}
    </div>
  )
})
