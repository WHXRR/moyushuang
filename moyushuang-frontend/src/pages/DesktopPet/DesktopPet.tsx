import CatBall from '@/assets/images/cat_ball.png'
import CatDrink from '@/assets/images/cat_drink.png'
import CatEat from '@/assets/images/cat_eat.png'
import CatPlay from '@/assets/images/cat_play.png'
import CatTouch from '@/assets/images/cat_touch.png'
import CatToilet from '@/assets/images/cat_toilet.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PetOptions } from './components/PetOptions'
import { generateCatMessage } from '@/interfaces/api'

export function DesktopPet() {
  const [message, setMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const requestIdRef = useRef(0)
  // 生成唯一请求ID
  const generateRequestId = () => (requestIdRef.current += 1)

  // 自动说话功能
  const generateMessage = useCallback(
    async (event?: string, forceGenerate = false) => {
      if (!forceGenerate && (isThinking || showMessage)) return
      const requestId = generateRequestId()
      try {
        setIsThinking(true)
        setShowMessage(true)
        const res = await generateCatMessage(event)
        if (
          (res.status === 201 || res.status === 200) &&
          requestIdRef.current === requestId
        ) {
          setMessage(res.data.data.message)
        }
      } catch (error) {
        setMessage('喵~')
        console.error('生成消息失败:', error)
      } finally {
        if (requestIdRef.current === requestId) {
          setIsThinking(false)
        }
      }
    },
    [isThinking, showMessage],
  )

  // 定时自动说话
  useEffect(() => {
    const interval = setInterval(() => {
      generateMessage()
    }, 600000)
    return () => clearInterval(interval)
  }, [generateMessage])

  useEffect(() => {
    generateMessage()
  }, [])

  const timerRef = useRef<number>(0)
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 500) as unknown as number
  }

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current)
    setIsHovered(true)
  }

  const [catStatus, setCatStatus] = useState('default')
  const handlePetStatus = (e: string) => {
    setCatStatus(e)
    setIsThinking(false)
    setShowMessage(false)
    generateMessage(e, true)
  }

  // 消息自动隐藏
  useEffect(() => {
    if (showMessage && !isThinking) {
      const timer = setTimeout(() => {
        setShowMessage(false)
        if (catStatus === 'default') return
        setCatStatus('default')
        setIsHovered(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showMessage, isThinking, message, catStatus])

  return (
    <div className="fixed w-28 h-28 right-10 bottom-10">
      <div
        className={`absolute top-3 -left-3 bg-[#ef857d] text-white p-2 rounded-md text-xs -translate-x-full transition-all duration-300 max-w-[200px] break-words pointer-events-none ${
          showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } after:content-[\"\"] after:absolute after:top-1/2 after:right-0 after:translate-x-full after:-translate-y-1/2 after:border-5 after:border-transparent after:border-l-[#ef857d]`}
      >
        {isThinking ? (
          <div className="flex gap-1 items-center leading-none">
            <svg
              className="w-5"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6686"
              fill="currentColor"
            >
              <path
                d="M779.9484908 760.0451679c-67.04932045 73.14471311-166.81472918 115.81246286-272.42673856 115.81246287-99.64101275 0-195.17696467-38.56268893-262.2262862-103.74607354-4.10506081-6.09539266-12.19078533-10.2004535-18.28617801-10.2004524s-14.30551321 1.99033185-18.28617799 8.21012053c-10.2004535 10.2004535-10.2004535 28.48663149 0 38.56268898 77.24977393 75.25944208 184.97651227 119.91752368 298.92303821 119.91752367 119.91752368 0 233.86404963-48.76314242 311.11382356-132.108309 10.2004535-10.2004535 10.2004535-28.48663149-1.99033186-38.56268898-10.3248495-10.07605747-26.62069456-10.07605747-36.82114915 2.11472787zM129.23421223 589.37416993c14.30551321 0 26.49629964-12.19078533 26.49629855-26.49629963 0-34.45762814 6.09539266-71.15438127 20.40090696-105.86080141 1.99033185-4.10506081 4.10506081-6.09539266 4.1050608-10.20045347 54.8585351-119.91752368 182.86178333-197.16729759 327.2852737-197.16729651 193.06223679 0 351.79124146 140.31842956 351.79124145 313.22855139 0 14.30551321 12.19078533 26.49629964 26.49629854 26.49629963s26.49629964-12.19078533 26.49629964-26.49629963c0-40.5530219-8.21012053-81.35483473-22.39123882-119.91752369 32.46729628-223.66359616-40.80181282-329.52439755-44.78247766-335.61979021-6.09539266-10.2004535-18.286178-14.30551321-30.60135934-10.20045349-42.66774975 14.30551321-126.01291636 89.56495526-160.71933652 119.91752368 0 0 0 1.99033185-1.99033294 1.99033186-93.54562008-32.59169229-195.17696467-32.59169229-290.71291658 0-12.19078533-10.2004535-111.70740206-103.74607356-160.71933652-119.91752261-10.2004535-4.10506081-22.39123882 0-30.60136045 10.2004524-4.10506081 4.10506081-75.25944208 107.72673837-44.65808161 327.28527477-16.29584615 40.5530219-24.50596668 83.34516659-24.50596668 126.01291635 2.2391239 14.55430523 14.30551321 26.74509056 28.61102748 26.74509057z m683.30597088-431.03134724c12.19078533 26.49629964 34.70642017 93.54562008 30.60135936 201.27235735-34.70642017-46.64841458-81.35483473-87.45022741-136.21336877-115.81246289 32.34290028-30.60135937 77.00098188-67.29811246 105.61200941-85.45989446z m-608.04652991 0c34.45762814 22.39123882 85.45989445 67.04932045 103.74607357 83.34516662-52.86820325 28.48663149-99.64101275 67.04932045-136.21336984 111.70740203-1.99033185-103.74607356 22.26684279-168.80506104 32.46729627-195.05256865z m40.80181284 467.47930832c0-8.21012053-4.10506081-14.30551321-10.20045238-18.2861791-6.09539266-4.10506081-12.19078533-6.09539266-18.28617909-6.09539265l-189.081572 18.28617911c-6.09539266 0-14.30551321 4.10506081-18.28617801 10.20045238-4.10506081 6.09539266-6.09539266 12.19078533-6.09539267 20.40090694 1.99033185 14.30551321 12.19078533 24.50596668 26.49629856 24.50596671H31.83232338l189.081572-18.286178c14.18111828-4.22945574 24.38157067-16.42024215 24.38157066-30.72575539z m24.25717575 71.15438126c-1.99033185-6.09539266-8.21012053-12.19078533-14.3055132-14.30551429-6.09539266-1.99033185-14.30551321-1.99033185-20.40090695 0l-182.86178333 75.25944205c-6.09539266 1.99033185-12.19078533 8.21012053-14.3055143 14.30551322-1.99033185 6.09539266-1.99033185 14.30551321 0 20.40090694 4.10506081 10.2004535 14.30551321 16.29584615 24.50596778 16.29584615 4.10506081 0 6.09539266 0 10.2004524-1.99033293l182.8617844-75.25944096c14.30551321-6.09539266 20.40090695-22.39123882 14.3055132-34.70642018z m744.25989976-67.04932152c-4.10506081-6.09539266-10.2004535-8.21012053-18.28617912-10.20045238l-189.08157197-18.28617911c-6.09539266 0-14.30551321 1.99033185-18.28617802 6.09539265-6.09539266 4.10506081-8.21012053 12.19078533-10.20045347 18.2861791 0 6.09539266 1.99033185 14.30551321 6.09539266 20.40090588 4.10506081 6.09539266 10.2004535 8.21012053 18.286178 10.20045348l189.08157308 18.286178h1.99033184c14.30551321 0 24.50596668-10.2004535 26.49629966-24.50596668 1.99033185-8.08572561 0-16.17145014-6.09539266-20.27651094z m-42.79214579 128.12764422l-182.86178332-75.25944099c-6.09539266-1.99033185-14.30551321-1.99033185-20.40090695 0s-12.19078533 8.21012053-14.30551321 14.30551321c-1.99033185 6.09539266-1.99033185 14.30551321 0 20.40090697s8.21012053 12.19078533 14.30551321 14.30551319l182.86178331 75.25944207c4.10506081 1.99033185 6.09539266 1.99033185 10.20045348 1.99033186 10.2004535 0 20.40090695-6.09539266 24.50596668-16.29584615 6.09539266-14.42990923-0.12439602-30.72575537-14.3055132-34.70642016zM668.11669274 463.11246156v-44.65808164c0-14.30551321-10.2004535-24.50596668-24.50596668-24.50596668s-24.50596668 10.2004535-24.50596668 24.50596668v44.65808164c0 14.30551321 10.2004535 24.50596668 24.50596668 24.50596776s24.50596668-10.2004535 24.50596667-24.50596776z m-264.46540898 0v-44.65808164c0-14.30551321-10.2004535-24.50596668-24.50596777-24.50596668s-24.50596668 10.2004535-24.5059667 24.50596668v44.65808164c0 14.30551321 10.2004535 24.50596668 24.5059667 24.50596776 14.55430523 0 24.50596668-10.2004535 24.50596777-24.50596776z m49.01193336 250.28429178c24.50596668 0 44.6580816-16.29584615 58.96359593-38.56268894 14.30551321 22.39123882 32.59169229 38.56268893 58.96359483 38.56268894 42.66774975 0 75.25944208-34.45762814 75.25944207-75.25944098 0-10.2004535-8.21012053-18.286178-18.286178-18.28617908-10.2004535 0-18.286178 8.21012053-18.28617912 18.28617908 0 22.39123882-18.286178 38.56268893-40.55302078 38.56268896-20.40090695 0-40.5530219-34.45762814-40.55302191-58.96359591 0-10.2004535-8.21012053-18.286178-18.28617801-18.286178-10.2004535 0-18.286178 8.21012053-18.28617908 18.286178 0 24.50596668-20.40090695 58.96359593-40.55302082 58.96359591-22.39123882 0-40.5530219-18.286178-40.55302189-38.56268896 0-10.2004535-8.21012053-18.286178-18.286178-18.28617908-10.2004535 0-18.286178 8.21012053-18.286178 18.28617908 3.48308183 40.5530219 35.95037813 75.25944208 78.74252278 75.25944098z"
                p-id="6687"
              ></path>
            </svg>
            <div>...</div>
          </div>
        ) : (
          message
        )}
      </div>
      <div className="w-28 h-28">
        {catStatus === 'default' ? (
          <div
            className="relative w-full h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={CatPlay}
              alt="pet"
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => generateMessage('click')}
            />
            <PetOptions
              isHovered={isHovered}
              handlePetStatus={handlePetStatus}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            {catStatus === 'eat' && (
              <img
                src={CatEat}
                alt="eat"
                className="w-full h-full object-contain pointer-events-none"
              />
            )}
            {catStatus === 'drink' && (
              <img
                src={CatDrink}
                alt="drink"
                className="w-full h-full object-contain pointer-events-none"
              />
            )}
            {catStatus === 'toilet' && (
              <img
                src={CatToilet}
                alt="toilet"
                className="w-full h-full object-contain pointer-events-none"
              />
            )}
            {catStatus === 'play' && (
              <img
                src={CatBall}
                alt="play"
                className="w-full h-full object-contain pointer-events-none"
              />
            )}
            {catStatus === 'touch' && (
              <img
                src={CatTouch}
                alt="touch"
                className="w-full h-full object-contain pointer-events-none"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
