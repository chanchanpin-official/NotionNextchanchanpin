import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

function normalizeMenuNodes(links = []) {
  const nodes = []

  links.forEach(link => {
    if (!link || link.show === false) return

    if (Array.isArray(link.subMenus) && link.subMenus.length > 0) {
      link.subMenus.forEach(sub => {
        if (!sub) return
        nodes.push({
          name: sub.title || sub.name,
          href: sub.href || link.href || '#',
          icon: sub.icon || link.icon
        })
      })
      return
    }

    nodes.push({
      name: link.name,
      href: link.href || '#',
      icon: link.icon
    })
  })

  return nodes.filter(node => node.name).slice(0, 8)
}

export default function HomeInterdisciplinary(props) {
  const { locale } = useGlobal()
  const { customMenu, customNav } = props

  const fallbackLinks = [
    {
      name: locale?.NAV?.SEARCH || 'Search',
      href: '/search',
      icon: 'fas fa-search',
      show: siteConfig('SIMPLE_MENU_SEARCH', null, CONFIG)
    },
    {
      name: locale?.NAV?.ARCHIVE || 'Archive',
      href: '/archive',
      icon: 'fas fa-archive',
      show: siteConfig('SIMPLE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      name: locale?.COMMON?.CATEGORY || 'Category',
      href: '/category',
      icon: 'fas fa-folder',
      show: siteConfig('SIMPLE_MENU_CATEGORY', null, CONFIG)
    },
    {
      name: locale?.COMMON?.TAGS || 'Tags',
      href: '/tag',
      icon: 'fas fa-tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    }
  ]

  let sourceLinks = fallbackLinks
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) {
    sourceLinks = customMenu
  } else if (customNav?.length) {
    sourceLinks = fallbackLinks.concat(customNav)
  }

  const circleNodes = normalizeMenuNodes(sourceLinks)
  const centerLabel = siteConfig(
    'SIMPLE_HOME_INTERDISCIPLINARY_CENTER',
    null,
    CONFIG
  )
  const introTitle = siteConfig('AUTHOR')
  const introBody =
    siteConfig('SIMPLE_HOME_INTRO_HTML', null, CONFIG) ||
    siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
  const bottomPng = siteConfig('SIMPLE_HOME_BOTTOM_PNG', null, CONFIG)

  return (
    <section className='w-full md:pr-8 mb-10'>
      <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 py-6 lg:py-10 items-center'>
        <div className='relative min-h-[360px] flex items-center justify-center'>
          <div className='absolute w-[260px] h-[260px] rounded-full border border-dashed border-blue-200 dark:border-gray-700' />

          {circleNodes.map((node, index) => {
            const angle = (Math.PI * 2 * index) / circleNodes.length - Math.PI / 2
            const radius = 130
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            return (
              <SmartLink
                key={`${node.name}-${index}`}
                href={node.href}
                className='absolute rounded-full border border-blue-200 dark:border-gray-700 bg-white dark:bg-black hover:border-red-300 hover:text-red-400 transition-all duration-200 shadow-sm'>
                <div
                  className='w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center text-center px-2 text-xs md:text-sm'
                  style={{ transform: `translate(${x}px, ${y}px)` }}>
                  {node.icon && <i className={`${node.icon} mb-1`} />}
                  <span className='line-clamp-2'>{node.name}</span>
                </div>
              </SmartLink>
            )
          })}

          <div className='w-36 h-36 rounded-full bg-blue-50 dark:bg-gray-900 border border-blue-300 dark:border-gray-700 flex items-center justify-center text-center px-4 text-sm font-semibold text-blue-600 dark:text-gray-200 shadow'>
            {centerLabel}
          </div>
        </div>

        <div className='space-y-4'>
          <h1 className='text-3xl md:text-4xl font-bold text-black dark:text-white'>
            {introTitle}
          </h1>
          <div
            className='text-gray-700 dark:text-gray-300 leading-8 text-base md:text-lg'
            dangerouslySetInnerHTML={{ __html: introBody }}
          />
          {siteConfig('BIO') && (
            <p className='text-sm md:text-base text-gray-500 dark:text-gray-400'>
              {siteConfig('BIO')}
            </p>
          )}
        </div>
      </div>

      {bottomPng && (
        <div className='mt-6 md:mt-10'>
          <LazyImage
            src={bottomPng}
            alt='home-bottom-art'
            className='w-full h-auto rounded-lg border border-gray-100 dark:border-gray-800'
          />
        </div>
      )}
    </section>
  )
}
