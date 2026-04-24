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
  const leftPng = siteConfig('SIMPLE_HOME_LEFT_PNG', null, CONFIG)
  const bottomPng = siteConfig('SIMPLE_HOME_BOTTOM_PNG', null, CONFIG)
  const nodeCount = circleNodes.length || 1

  return (
    <section className='w-full md:pr-8 mb-10'>
      <div className='mx-auto max-w-[1240px] px-1 md:px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-[560px_minmax(0,1fr)] gap-8 lg:gap-12 py-4 md:py-8 items-center'>
          <div className='relative h-[440px] md:h-[520px] flex items-center justify-center overflow-hidden'>
            {leftPng && (
              <LazyImage
                src={leftPng}
                alt='interdisciplinary-background'
                className='absolute inset-0 w-full h-full object-contain opacity-95'
              />
            )}
            <div className='absolute w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full border border-dashed border-blue-200 dark:border-gray-700' />

            {circleNodes.map((node, index) => {
              const angle = (Math.PI * 2 * index) / nodeCount - Math.PI / 2
              const radius = 170
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <SmartLink
                  key={`${node.name}-${index}`}
                  href={node.href}
                  className='absolute left-1/2 top-1/2 w-[92px] h-[92px] md:w-[110px] md:h-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200 dark:border-gray-700 bg-white/95 dark:bg-black/90 hover:border-red-300 hover:text-red-400 transition-all duration-200 shadow-sm flex flex-col items-center justify-center text-center px-2 text-xs md:text-sm'
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                  {node.icon && <i className={`${node.icon} mb-1`} />}
                  <span className='leading-tight break-words'>{node.name}</span>
                </SmartLink>
              )
            })}

            {circleNodes.length === 0 && (
              <div className='absolute left-1/2 top-1/2 w-[110px] h-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200 dark:border-gray-700 bg-white dark:bg-black flex items-center justify-center text-center px-2 text-xs'>
                请先配置菜单
              </div>
            )}

            <div className='relative z-10 w-40 h-40 md:w-44 md:h-44 rounded-full bg-blue-50/95 dark:bg-gray-900 border border-blue-300 dark:border-gray-700 flex items-center justify-center text-center px-5 text-sm md:text-base font-semibold text-blue-600 dark:text-gray-200 shadow'>
              {centerLabel}
            </div>
          </div>

          <div className='space-y-5 md:space-y-7'>
            <h1 className='text-3xl md:text-5xl font-bold text-black dark:text-white tracking-tight'>
              {introTitle}
            </h1>
            <div
              className='text-gray-700 dark:text-gray-300 leading-8 text-base md:text-xl'
              dangerouslySetInnerHTML={{ __html: introBody }}
            />
            {siteConfig('BIO') && (
              <p className='text-sm md:text-lg text-gray-500 dark:text-gray-400'>
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
      </div>
    </section>
  )
}
