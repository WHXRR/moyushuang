import { Eat } from './Eat'
import { Drink } from './Drink'
import { Toilet } from './Toilet'
import { Play } from './Play'
import { Touch } from './Touch'

interface PetOptionsProps {
  isHovered?: boolean
  handlePetStatus: (e: string) => void
}

export function PetOptions({ isHovered, handlePetStatus }: PetOptionsProps) {
  const buttons = [
    { id: 'eat', label: '吃饭', icon: <Eat /> },
    { id: 'drink', label: '喝水', icon: <Drink /> },
    { id: 'toilet', label: '上厕所', icon: <Toilet /> },
    { id: 'play', label: '玩耍', icon: <Play /> },
    { id: 'touch', label: '摸', icon: <Touch /> },
  ]

  const getButtonStyle = (index: number) => {
    if (!isHovered) {
      return {
        transform: 'translate(0, 0) scale(0)',
        opacity: 0,
        transitionDelay: `${index * 50}ms`,
      }
    }
    const totalButtons = buttons.length
    const angle = (index / (totalButtons - 1)) * Math.PI
    const radiusX = 70
    const radiusY = 60

    // 使用标准椭圆参数方程计算位置
    const x = radiusX * Math.cos(angle) - radiusX + 70
    const y = -radiusY * Math.sin(angle) - 20

    return {
      transform: `translate(${x}px, ${y}px) scale(1)`,
      opacity: 1,
      transitionDelay: `${index * 50}ms`,
    }
  }
  return (
    <div>
      {buttons.map((button, index) => (
        <div
          key={button.id}
          className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#ef857d] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-500 ease-out"
          style={getButtonStyle(index)}
          onClick={() => handlePetStatus(button.id)}
          title={button.label}
        >
          {button.icon}
        </div>
      ))}
    </div>
  )
}
