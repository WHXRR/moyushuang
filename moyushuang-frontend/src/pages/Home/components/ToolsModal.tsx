import {
  getChatroomStatus,
  updateChatroomControlMode,
  updateChatroomManualStatus,
} from '@/interfaces/api'
import useStore from '@/store'
import { Modal, Switch } from 'antd'
import { useState } from 'react'

export function ToolsModal(props: { open: boolean; onCancel: () => void }) {
  const { open, onCancel } = props

  const { chatroomStatus, updateChatroomStatus } = useStore()
  const [controlLoading, setControlLoading] = useState(false)
  const changeChatroomControlMode = async (status: boolean) => {
    setControlLoading(true)
    try {
      const res = await updateChatroomControlMode(status ? 'auto' : 'manual')
      if (res.status === 201 || res.status === 200) {
        getChatroomStatus().then((res) => {
          updateChatroomStatus({
            isOpen: res.data.isOpen,
            closeTime: res.data.closeTime,
            status: res.data.status,
          })
        })
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setControlLoading(false)
    }
  }

  const changeChatroomManualStatus = async (status: boolean) => {
    setControlLoading(true)
    try {
      const res = await updateChatroomManualStatus(status)
      if (res.status === 201 || res.status === 200) {
        getChatroomStatus().then((res) => {
          updateChatroomStatus({
            isOpen: res.data.isOpen,
            closeTime: res.data.closeTime,
            status: res.data.status,
          })
        })
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setControlLoading(false)
    }
  }
  return (
    <>
      <Modal
        title="设置"
        closable={{ 'aria-label': 'Custom Close Button' }}
        footer={null}
        open={open}
        onCancel={onCancel}
      >
        <div className="flex gap-2 mt-4">
          <div>模式</div>
          <Switch
            checkedChildren="自动模式"
            unCheckedChildren="手动模式"
            checked={chatroomStatus.status === 'auto'}
            onChange={changeChatroomControlMode}
            loading={controlLoading}
          />
        </div>
        {chatroomStatus.status === 'manual' && (
          <div className="flex gap-2 mt-4">
            <div>状态</div>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={chatroomStatus.isOpen}
              onChange={changeChatroomManualStatus}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
