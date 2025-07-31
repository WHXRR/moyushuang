import BlogImage from '@/assets/images/blog.png'
import MusicImage from '@/assets/images/music-icon.png'
import TranslateImage from '@/assets/images/translate.svg'

export function Tools() {
  return (
    <div className="space-y-3">
      <a
        href="http://whxrr.top"
        target="_blank"
        title="念白集"
        className="block"
      >
        <img className="w-full" src={BlogImage} alt="念白集" />
      </a>
      <a
        href="https://whxrr.github.io/CloudMusic"
        target="_blank"
        title="云音乐"
        className="block"
      >
        <img className="w-full" src={MusicImage} alt="云音乐" />
      </a>
      <a
        href="https://marketplace.visualstudio.com/items?itemName=WHXRR.code-lingo"
        target="_blank"
        title="codeLingo"
        className="block"
      >
        <img className="w-full" src={TranslateImage} alt="codeLingo" />
      </a>
    </div>
  )
}
