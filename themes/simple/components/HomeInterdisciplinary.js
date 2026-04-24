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

function findNodeByKeyword(nodes = [], keyword = '') {
  if (!keyword) return null
  const lower = keyword.toLowerCase()
  return (
    nodes.find(
      node =>
        node?.name?.toLowerCase().includes(lower) ||
        node?.href?.toLowerCase().includes(lower)
    ) || null
  )
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
  const visualNodes = {
    architecture:
      findNodeByKeyword(circleNodes, 'architecture') || circleNodes[0] || null,
    visualDesign:
      findNodeByKeyword(circleNodes, 'visual') || circleNodes[1] || null,
    hci: findNodeByKeyword(circleNodes, 'hci') || circleNodes[2] || null,
    ixd:
      findNodeByKeyword(circleNodes, 'ixd') ||
      findNodeByKeyword(circleNodes, 'interaction') ||
      circleNodes[3] ||
      null,
    ux: findNodeByKeyword(circleNodes, 'ux') || circleNodes[4] || null,
    service:
      findNodeByKeyword(circleNodes, 'service') ||
      findNodeByKeyword(circleNodes, 'pssd') ||
      circleNodes[5] ||
      null
  }

  return (
    <section className='w-full bg-[#ececec] border-t border-gray-200 mb-10 font-serif'>
      <div className='mx-auto max-w-[1800px] px-4 md:px-10 py-10 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-6 items-start'>
          <div className='relative h-[660px] md:h-[760px] overflow-hidden'>
            {leftPng && (
              <LazyImage
                src={leftPng}
                alt='interdisciplinary-background'
                className='absolute inset-0 w-full h-full object-contain opacity-90'
              />
            )}
            <div className='absolute left-[6%] top-[32%] w-[520px] h-[340px] rounded-[48%] border border-white/40 bg-[#d9d9d9]/30 -rotate-[29deg]' />
            <div className='absolute left-[24%] top-[22%] w-[430px] h-[430px] rounded-full border border-[#c4c9ce] bg-[#cfd3d9]/58' />
            <div className='absolute left-[37%] top-[36%] w-[290px] h-[290px] rounded-full border border-white/50 bg-[#e8e0da]/90' />

            {[
              {
                node: visualNodes.architecture,
                cls: 'left-[38%] top-[8%] w-[210px] h-[420px] bg-[#d8a88f]/85'
              },
              {
                node: visualNodes.visualDesign,
                cls: 'left-[12%] top-[38%] w-[380px] h-[230px] bg-[#ddc8bc]/88'
              },
              {
                node: visualNodes.hci,
                cls: 'left-[57%] top-[43%] w-[390px] h-[190px] bg-[#dfa07f]/85'
              },
              {
                node: visualNodes.ixd,
                cls: 'left-[37%] top-[36%] w-[290px] h-[290px] bg-[#e2d9d2]/92'
              }
            ]
              .filter(item => item.node)
              .map((item, index) => (
              <SmartLink
                key={`${item.node.name}-${index}`}
                href={item.node.href}
                className={`absolute rounded-[999px] border border-white/60 hover:brightness-95 transition-all duration-200 flex items-center justify-center text-center px-4 ${item.cls}`}>
                <span className='text-xl md:text-[42px] font-normal text-black/85 whitespace-nowrap'>
                  {item.node.name}
                </span>
              </SmartLink>
              ))}

            {visualNodes.ux && (
              <SmartLink
                href={visualNodes.ux.href}
                className='absolute left-[41%] top-[68%] text-2xl md:text-[42px] text-black/80 hover:underline'>
                {visualNodes.ux.name}
              </SmartLink>
            )}
            {visualNodes.service && (
              <SmartLink
                href={visualNodes.service.href}
                className='absolute left-[12%] top-[79%] text-2xl md:text-[42px] text-black/80 hover:underline'>
                {visualNodes.service.name}
              </SmartLink>
            )}

            {!visualNodes.architecture &&
              !visualNodes.visualDesign &&
              !visualNodes.hci &&
              !visualNodes.ixd && (
              <div className='absolute left-1/2 top-1/2 w-[180px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-gray-400 bg-white/70 flex items-center justify-center text-center px-2 text-xs'>
                请先配置菜单
              </div>
            )}

            <div className='absolute left-[44%] top-[58%] text-3xl md:text-4xl text-black/75'>
              {centerLabel}
            </div>
          </div>

          <div className='space-y-9 md:space-y-12 pr-2 md:pr-12 pt-10 md:pt-24'>
            <h1 className='text-4xl md:text-[56px] font-normal text-black tracking-tight'>
              {introTitle}
            </h1>
            <div
              className='text-black/90 leading-[1.7] text-[24px] md:text-[46px]'
              dangerouslySetInnerHTML={{ __html: introBody }}
            />
            {siteConfig('BIO') && (
              <p className='text-xl md:text-[40px] text-black/70 leading-[1.6]'>
                {siteConfig('BIO')}
              </p>
            )}
          </div>
        </div>

        {bottomPng && (
          <div className='mt-8 md:mt-12'>
            <LazyImage
              src={bottomPng}
              alt='home-bottom-art'
              className='w-full h-auto'
            />
          </div>
        )}
      </div>
    </section>
  )
}
