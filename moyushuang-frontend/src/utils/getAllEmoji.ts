export default function getAllEmoji() {
  const modules = import.meta.glob('@/assets/images/emoji/*.png', {
    eager: true,
    import: 'default',
  })

  const images = Object.entries(modules).map(([path, src]) => {
    const name = path.split('/').pop()?.replace('.png', '') || ''
    return { name, src: src as string }
  })

  return images
}
