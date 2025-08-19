import { Tools } from './Tools'
import { Header } from './Header'
import { ChatroomList } from './ChatroomList'
import { UnderMaintenance } from '@/components/UnderMaintenance'

export default function Home() {
  return (
    <div className="flex h-full">
      <div className="w-[50px] hidden md:block border-r border-gray-200 p-2">
        <Tools />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-4">
          <Header />
        </div>
        <div className="flex-1">
          <ChatroomList />
        </div>
      </div>
      <UnderMaintenance />
    </div>
  )
}
