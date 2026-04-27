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

  return nodes.filter(node => node.name).slice(0, 10)
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
  return merged.slice(0, 10)
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
  const introBody = siteConfig('SIMPLE_HOME_INTRO_HTML', null, CONFIG)
  const leftPng = siteConfig('SIMPLE_HOME_LEFT_PNG', null, CONFIG)
  const bottomPng = siteConfig('SIMPLE_HOME_BOTTOM_PNG', null, CONFIG)
  const mapFontSize = Number(siteConfig('SIMPLE_HOME_MAP_FONT_SIZE', null, CONFIG)) || 18
  const titleFontSize = Number(siteConfig('SIMPLE_HOME_TITLE_FONT_SIZE', null, CONFIG)) || 56
  const bodyFontSize = Number(siteConfig('SIMPLE_HOME_BODY_FONT_SIZE', null, CONFIG)) || 24
  const bioFontSize = Number(siteConfig('SIMPLE_HOME_BIO_FONT_SIZE', null, CONFIG)) || 20
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
  const menuNodes = buildVisualNodes(normalizeMenuNodes(focusedLinks), aliasConfig)

  const visualNodes = {
    architecture:
      findNodeByKeyword(menuNodes, 'architecture') || menuNodes[0] || null,
    visualDesign: findNodeByKeyword(menuNodes, 'visual') || menuNodes[1] || null,
    hci: findNodeByKeyword(menuNodes, 'hci') || menuNodes[2] || null,
    ixd:
      findNodeByKeyword(menuNodes, 'ixd') ||
      findNodeByKeyword(menuNodes, 'interaction') ||
      menuNodes[3] ||
      null,
    ux: findNodeByKeyword(menuNodes, 'ux') || menuNodes[4] || null,
    service:
      findNodeByKeyword(menuNodes, 'service') ||
      findNodeByKeyword(menuNodes, 'pssd') ||
      menuNodes[5] ||
      null
  }

  const clickableGroups = [
    {
      label: 'Architecture',
      node: visualNodes.architecture,
      className:
        'left-[39%] top-[6%] w-[20%] h-[48%] rounded-[50%]'
    },
    {
      label: 'Visual Design',
      node: visualNodes.visualDesign,
      className:
        'left-[10%] top-[37%] w-[37%] h-[25%] rounded-[50%]'
    },
    {
      label: 'HCI',
      node: visualNodes.hci,
      className:
        'left-[58%] top-[43%] w-[36%] h-[23%] rounded-[50%]'
    },
    {
      label: 'IxD',
      node: visualNodes.ixd,
      className:
        'left-[38%] top-[37%] w-[28%] h-[30%] rounded-full'
    }
  ].filter(item => item.node)

  return (
    <section className='relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA] border-t border-[#edf0f3] mb-10'>
      <div className='mx-auto max-w-[1700px] px-0 md:px-0 py-10 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-[58%_42%] gap-8 lg:gap-12 items-start'>
          <div className='relative h-[620px] md:h-[760px]'>
            {leftPng ? (
              <LazyImage
                src={leftPng}
                alt='discipline-map'
                className='absolute inset-0 w-full h-full object-contain'
              />
            ) : (
              <svg
                className='absolute inset-0 w-full h-full'
                viewBox='0 0 1000 760'
                preserveAspectRatio='xMidYMid meet'>
                <ellipse
                  cx='300'
                  cy='470'
                  rx='310'
                  ry='190'
                  fill='#d9d9d9'
                  fillOpacity='0.38'
                  transform='rotate(-28 300 470)'
                />
                <circle
                  cx='470'
                  cy='430'
                  r='220'
                  fill='#cfd3d9'
                  fillOpacity='0.60'
                />
                <circle
                  cx='510'
                  cy='470'
                  r='145'
                  fill='#e8e0da'
                  fillOpacity='0.92'
                />
                <ellipse
                  cx='470'
                  cy='255'
                  rx='105'
                  ry='205'
                  fill='#d8a88f'
                  fillOpacity='0.88'
                />
                <ellipse
                  cx='275'
                  cy='410'
                  rx='190'
                  ry='118'
                  fill='#ddc8bc'
                  fillOpacity='0.90'
                />
                <ellipse
                  cx='740'
                  cy='430'
                  rx='190'
                  ry='100'
                  fill='#dfa07f'
                  fillOpacity='0.88'
                />
              </svg>
            )}

            {clickableGroups.map((item, index) => (
              <SmartLink
                key={`${item.node.name}-${index}`}
                href={item.node.href}
                className={`absolute ${item.className} flex items-center justify-center text-center hover:brightness-95 transition-all duration-200`}>
                <span
                  className='leading-none text-black/85 whitespace-nowrap'
                  style={{ fontSize: `${mapFontSize}px` }}>
                  {item.label}
                </span>
              </SmartLink>
            ))}

            {visualNodes.ux && (
              <SmartLink
                href={visualNodes.ux.href}
                className='absolute left-[41%] top-[67%] text-black/80 hover:underline'
                style={{ fontSize: `${mapFontSize}px` }}>
                UX
              </SmartLink>
            )}
            {visualNodes.service && (
              <SmartLink
                href={visualNodes.service.href}
                className='absolute left-[14%] top-[78%] text-black/80 hover:underline'
                style={{ fontSize: `${mapFontSize}px` }}>
                Service Design
              </SmartLink>
            )}

            <div
              className='absolute left-[46%] top-[57%] text-black/70'
              style={{ fontSize: `${Math.max(18, mapFontSize - 2)}px` }}>
              {centerLabel}
            </div>
          </div>

          <div className='pt-8 md:pt-20 pr-2 md:pr-10 space-y-8 md:space-y-12'>
            <h1
              className='font-normal text-black leading-tight'
              style={{ fontSize: `${titleFontSize}px` }}>
              {introTitle}
            </h1>
            {introBody && (
              <div
                className='text-black/90 leading-[1.8]'
                style={{ fontSize: `${bodyFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: introBody }}
              />
            )}
            {siteConfig('BIO') && (
              <p
                className='text-black/70 leading-[1.7]'
                style={{ fontSize: `${bioFontSize}px` }}>
                {siteConfig('BIO')}
              </p>
            )}
          </div>
        </div>

        {bottomPng && (
          <div className='mt-8 md:mt-14'>
            <LazyImage src={bottomPng} alt='home-bottom-art' className='w-full h-auto' />
          </div>
        )}
      </div>
    </section>
  )
}
