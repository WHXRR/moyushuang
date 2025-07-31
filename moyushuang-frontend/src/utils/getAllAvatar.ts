export default function getAllAvatar() {
  const modules = import.meta.glob('@/assets/images/avatar/*.svg', {
    eager: true,
    import: 'default',
  })

  const images = Object.entries(modules).map(([path, src]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || ''
    return { name, src: src as string }
  })

  return images
}
