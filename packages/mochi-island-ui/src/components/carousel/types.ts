export interface MochiCarouselItem {
  key: string
  /** 无障碍描述，同时作为图片 alt 的来源 */
  alt?: string
  [key: string]: unknown
}
