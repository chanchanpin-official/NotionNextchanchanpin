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

function pickSubmenuSource(links = [], preferredParentName = '') {
  if (!Array.isArray(links) || links.length === 0) return links

  if (preferredParentName) {
    const preferred = links.find(
      link =>
        link &&
        link.show !== false &&
        link.name &&
        link.name.includes(preferredParentName) &&
        Array.isArray(link.subMenus) &&
        link.subMenus.length > 0
    )
    if (preferred) return [preferred]
  }

  const firstSubmenuParent = links.find(
    link =>
      link &&
      link.show !== false &&
      Array.isArray(link.subMenus) &&
      link.subMenus.length > 0
  )

  return firstSubmenuParent ? [firstSubmenuParent] : links
}

function parseAliasConfig(rawValue = '') {
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(item => item?.name && item?.match)
  } catch (error) {
    return []
  }
}

function buildVisualNodes(nodes = [], aliasConfig = []) {
  if (!aliasConfig.length) return nodes

  const aliasNodes = aliasConfig
    .map(alias => {
      const target = nodes.find(
        node =>
          node.name?.toLowerCase().includes(alias.match.toLowerCase()) ||
          node.href?.toLowerCase().includes(alias.match.toLowerCase())
      )
      if (!target) return null
      return {
        name: alias.name,
        href: target.href,
        icon: alias.icon || target.icon
      }
    })
    .filter(Boolean)

  const merged = [...nodes]
  aliasNodes.forEach(aliasNode => {
    if (!merged.some(node => node.name === aliasNode.name)) {
      merged.push(aliasNode)
    }
  })
  return merged.slice(0, 8)
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
  const preferredSubmenuParent = siteConfig(
    'SIMPLE_HOME_SUBMENU_PARENT',
    null,
    CONFIG
  )
  const focusedLinks = pickSubmenuSource(sourceLinks, preferredSubmenuParent)
  const aliasConfigRaw = siteConfig('SIMPLE_HOME_NODE_ALIASES', null, CONFIG)
  const aliasConfig =
    parseAliasConfig(aliasConfigRaw).length > 0
      ? parseAliasConfig(aliasConfigRaw)
      : [{ name: 'Architecture', match: 'Other Works' }]
  const circleNodes = buildVisualNodes(
    normalizeMenuNodes(focusedLinks),
    aliasConfig
  )
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
            <div className='absolute w-[310px] h-[180px] md:w-[360px] md:h-[210px] rounded-[100%] border border-dashed border-blue-200/80 dark:border-gray-700 [transform:rotate(-16deg)]' />
            <div className='absolute w-[230px] h-[130px] md:w-[280px] md:h-[160px] rounded-[100%] border border-blue-200/60 dark:border-gray-700 [transform:rotate(-16deg)]' />

            {circleNodes.map((node, index) => {
              const angle = (Math.PI * 2 * index) / nodeCount - Math.PI / 2
              const xRadius = 185
              const yRadius = 105
              const x = Math.cos(angle) * xRadius
              const y = Math.sin(angle) * yRadius

              return (
                <SmartLink
                  key={`${node.name}-${index}`}
                  href={node.href}
                  className='absolute left-1/2 top-1/2 w-[126px] h-[62px] md:w-[150px] md:h-[72px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-blue-200 dark:border-gray-700 bg-white/95 dark:bg-black/90 hover:border-red-300 hover:text-red-400 transition-all duration-200 shadow-sm flex flex-col items-center justify-center text-center px-3 text-xs md:text-sm [transform:skewX(-16deg)]'
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) skewX(-16deg)`
                  }}>
                  {node.icon && <i className={`${node.icon} mb-1`} />}
                  <span className='leading-tight break-words [transform:skewX(16deg)]'>
                    {node.name}
                  </span>
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
