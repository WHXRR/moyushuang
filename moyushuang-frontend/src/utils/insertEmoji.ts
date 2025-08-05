import getAllEmoji from './getAllEmoji'

interface Image {
  name: string
  src: string
}
export function insertEmoji(
  image: Image,
  savedRange: Range,
  inputEl: HTMLElement,
) {
  const selection = window.getSelection()
  if (!selection) return

  // 恢复之前保存的光标位置
  selection.removeAllRanges()
  selection.addRange(savedRange)

  // 创建表情图片节点
  const img = document.createElement('img')
  img.src = image.src
  img.alt = ''
  img.className = 'inline-block mx-1 w-4 h-4 align-text-bottom'
  img.dataset.name = image.name

  // 插入图片
  savedRange.deleteContents()
  savedRange.insertNode(img)

  // 创建一个新的 range，用于将光标放到图片后面
  const newRange = document.createRange()
  newRange.setStartAfter(img)
  newRange.collapse(true)

  // 应用新的 range 到 selection
  selection.removeAllRanges()
  selection.addRange(newRange)

  // 更新保存的 range（以便插入多个表情时光标正确）
  savedRange.setStartAfter(img)
  savedRange.collapse(true)

  // 重新 focus 到输入框（避免失焦）
  inputEl.focus()
}

export function transformEmojiHtmlToText(html: string): string {
  const container = document.createElement('div')
  container.innerHTML = html

  const imgs = container.querySelectorAll('img[data-name]')
  imgs.forEach((img) => {
    const name = img.getAttribute('data-name')
    const emojiText = name ? `[emoji:${name}]` : ''
    const textNode = document.createTextNode(emojiText)
    img.replaceWith(textNode)
  })

  return container.innerHTML
}

export function transformTextToEmojiHtml(text: string): string {
  const images = getAllEmoji()
  return text.replace(/\[emoji:([^\]]+)\]/g, (_, name) => {
    const image = images.find((item) => item.name === name)
    if (!image) return `[emoji:${name}]`
    return `<img src="${image.src}" alt="${name}" class="inline-block mx-1 w-4 h-4 align-text-bottom" data-name="${name}" />`
  })
}
