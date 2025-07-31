import { Suspense, type JSX } from 'react'
import CatImage from '@/assets/images/cat.png'

function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <img src={CatImage} alt="cat" className="w-40" />
    </div>
  )
}

export default function WithSuspense(Component: JSX.Element) {
  return <Suspense fallback={<Loading />}>{Component}</Suspense>
}
