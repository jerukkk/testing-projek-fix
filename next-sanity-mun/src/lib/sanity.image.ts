import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from '@/lib/sanity.config'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || ''
})

export const urlForImage = (source: any) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}