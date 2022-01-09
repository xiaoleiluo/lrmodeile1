import defaultSettings from '@/settings'

const title = defaultSettings.title || '行程码管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
