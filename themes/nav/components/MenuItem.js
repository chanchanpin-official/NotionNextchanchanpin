import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import Collapse from './Collapse'

/**
 * 菜单
 * @param {} param0
 * @returns
 */
export const MenuItem = ({ link }) => {
  link.selected = true
  const router = useRouter()
  const activeSubMenuRef = useRef(null)

  const currentPath = useMemo(() => {
    if (!router?.asPath) {
      return ''
    }
    return router.asPath.split('?')[0].split('#')[0]
  }, [router?.asPath])

  const hasMatchedSubMenu = useMemo(() => {
    if (!link?.subMenus?.length || !currentPath) {
      return false
    }
    return link.subMenus.some(sLink => {
      const subMenuPath = (sLink?.href || '').split('?')[0].split('#')[0]
      return Boolean(subMenuPath) && subMenuPath === currentPath
    })
  }, [link?.subMenus, currentPath])

  const [isOpen, changeIsOpen] = useState(link?.selected || hasMatchedSubMenu)

  useEffect(() => {
    if (hasMatchedSubMenu) {
      changeIsOpen(true)
    }
  }, [hasMatchedSubMenu])

  useEffect(() => {
    if (!hasMatchedSubMenu || !activeSubMenuRef.current) {
      return
    }

    const menuContainer = activeSubMenuRef.current.closest('.main-menu')
    if (!menuContainer) {
      return
    }

    const targetOffsetTop =
      activeSubMenuRef.current.offsetTop - menuContainer.offsetTop
    menuContainer.scrollTo({
      top: Math.max(targetOffsetTop - 20, 0),
      behavior: 'smooth'
    })
  }, [hasMatchedSubMenu, currentPath])

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  if (!link || !link.show) {
    return null
  }

  // #号加标题  快速跳转到指定锚点
  const isAnchor = link?.href === '#'
  const url = isAnchor ? `#${link.name}` : link.href

  return (
    <>
      {/* 菜单 */}
      <div
        onClick={toggleOpenSubMenu}
        className='nav-menu dark:text-neutral-400 text-gray-500 hover:text-black dark:hover:text-white text-sm text-gray w-full items-center duration-300 pt-2 font-light select-none flex justify-between cursor-pointer'
        key={link?.href}>
        {link?.subMenus ? (
          <>
            <span className='dark:text-neutral-400 dark:hover:text-white font-bold w-full display-block'>
              <i className={`text-base ${link?.icon ? link?.icon : ''} mr-1`} />
              {link?.title}
            </span>
            <div className='inline-flex items-center select-none pointer-events-none '>
              <i
                className={`${isOpen ? '-rotate-90' : ''} text-xs dark:text-neutral-500 text-gray-300 hover:text-black dark:hover:text-white-400 px-2 fas fa-chevron-left transition-all duration-200`}></i>
            </div>
          </>
        ) : (
          <SmartLink
            href={url}
            className='dark:text-neutral-400 dark:hover:text-white font-bold w-full display-block'>
            <i
              className={`text-base ${link?.icon ? link?.icon : isAnchor ? 'fas fa-hashtag' : ''} mr-1`}
            />
            {link?.title}
          </SmartLink>
        )}
      </div>

      {/* 子菜单按钮 */}
      {link?.subMenus && (
        <Collapse isOpen={isOpen} key='collapse'>
          {link?.subMenus?.map((sLink, index) => {
            // #号加标题  快速跳转到指定锚点
            const sIsAnchor = sLink?.href === '#'
            const sUrl = sIsAnchor ? `#${sLink.name}` : sLink.href
            const sPath = (sLink?.href || '').split('?')[0].split('#')[0]
            const isCurrentSubMenu = Boolean(sPath) && sPath === currentPath
            return (
              <div
                key={index}
                ref={isCurrentSubMenu ? activeSubMenuRef : null}
                className='nav-submenu'>
                <SmartLink href={sUrl}>
                  <span className='dark:text-neutral-400 text-gray-500 hover:text-black dark:hover:text-white text-xs font-bold'>
                    <i
                      className={`text-xs mr-1 ${sLink?.icon ? sLink?.icon : sIsAnchor ? 'fas fa-hashtag' : ''}`}
                    />
                    {sLink.title}
                  </span>
                </SmartLink>
              </div>
            )
          })}
        </Collapse>
      )}
    </>
  )
}
