const images = import.meta.glob('@/assets/images/avatar/*.svg', {
  eager: true,
  import: 'default',
})

export type AvatarType =
  | 'baimao'
  | 'bianmu'
  | 'buoumao'
  | 'cangshu'
  | 'chaiquan'
  | 'fadou'
  | 'hashiqi'
  | 'heimao'
  | 'helanzhu'
  | 'jinmao'
  | 'jumao'
  | 'kedaya'
  | 'keji'
  | 'lachangquan'
  | 'lanmao'
  | 'nainiumao'
  | 'sanhuamao'
  | 'tianyuanquan'
  | 'wumaomao'
  | 'xianluomao'
  | 'yang'
  | 'zangao'

export function Avatar({
  headPic,
  className,
}: {
  headPic: AvatarType
  className?: string
}) {
  const imgSrc = images[`/src/assets/images/avatar/${headPic}.svg`] as string
  return <img src={imgSrc} alt={headPic} className={className} />
}
