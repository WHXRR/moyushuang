import { useNavigate } from 'react-router-dom'
import React from 'react'
import type { Chatroom } from '@/types/chat'
import { Popconfirm } from 'antd'
import { WithPermission } from '@/components/WithPermission'

export const ChatroomBox = React.memo((props: Chatroom) => {
  const navigate = useNavigate()

  return (
    <div
      key={props.id}
      className="cursor-pointer rounded-lg p-3 relative group bg-[#ef857d] text-white"
      onClick={() => navigate(`/chatroom/${props.id}`)}
    >
      <div className="pb-1 pr-10">
        {props.name} ({props.userCount})
      </div>
      <div className="text-[10px] opacity-90">
        {new Date(props.createTime).toLocaleString()}
      </div>
      <WithPermission>
        <div className="absolute right-2 top-3 flex space-x-2">
          <svg
            className="w-4 md:opacity-0 transition-all group-hover:opacity-100"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8631"
            fill="currentColor"
            onClick={(e) => {
              e.stopPropagation()
              props.updateChatroom()
            }}
          >
            <path
              d="M934.989824 798.204928 728.061952 591.27296c0 0-25.198592-21.021696-8.148992-47.665152 16.918528-40.154112 26.3424-84.230144 26.3424-130.541568 0-186.354688-151.068672-337.419264-337.424384-337.419264-32.124928 0-63.101952 4.70016-92.489728 13.186048-25.182208 8.679424-7.297024 26.976256-7.297024 26.976256L464.493568 271.2576c49.924096 49.92 49.924096 130.86208 0 180.786176l-15.066112 15.062016c-49.92 49.924096-130.86208 49.924096-180.786176 0L110.743552 309.209088c0 0-16.201728-13.57312-24.827904 6.810624-9.329664 30.738432-14.501888 63.26272-14.501888 97.045504 0 186.354688 151.064576 337.42848 337.419264 337.42848 50.5088 0 98.400256-11.140096 141.4144-31.04256 19.42528-10.06592 33.886208 6.510592 33.886208 6.510592l211.454976 211.64032c21.174272 21.178368 50.19136 29.737984 77.707264 25.67168 0 0 71.246848-6.39488 87.115776-85.777408C965.049344 849.519616 956.57472 819.785728 934.989824 798.204928z"
              p-id="8632"
            ></path>
          </svg>
          <Popconfirm
            title="确认要删除吗？"
            onConfirm={(e) => {
              e?.stopPropagation()
              props.delGroup()
            }}
            okText="Yes"
            cancelText="No"
            placement="bottom"
          >
            <svg
              className="w-4 md:opacity-0 transition-all group-hover:opacity-100"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9637"
              fill="currentColor"
              onClick={(e) => e.stopPropagation()} // 阻止点击图标冒泡
            >
              <path
                d="M900.096 304.128H123.904a34.133333 34.133333 0 1 1 0-68.266667h776.192a34.133333 34.133333 0 0 1 0 68.266667zM379.562667 212.650667a132.437333 132.437333 0 0 1 264.874666 0"
                p-id="9638"
              ></path>
              <path
                d="M187.733333 235.861333v570.368a136.533333 136.533333 0 0 0 136.533334 136.533334h375.466666a136.533333 136.533333 0 0 0 136.533334-136.533334V235.861333z m225.962667 536.576a34.133333 34.133333 0 0 1-68.266667 0v-378.88a34.133333 34.133333 0 0 1 68.266667 0z m264.874667 0a34.133333 34.133333 0 0 1-68.266667 0v-378.88a34.133333 34.133333 0 1 1 68.266667 0z"
                p-id="9639"
              ></path>
            </svg>
          </Popconfirm>
        </div>
      </WithPermission>
    </div>
  )
})
