import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center flex items-center justify-center flex-col h-full leading-loose">
      <div className="font-bold text-3xl pb-5">找不到您要查找的页面。</div>
      <div>该页面已被移动或删除，输入的 URL 可能有错误。</div>
      <div>很抱歉给您带来麻烦，请转到首页。请回来。</div>
      <Link className="pt-5" to={'/'}>
        返回登录
      </Link>
    </div>
  )
}
