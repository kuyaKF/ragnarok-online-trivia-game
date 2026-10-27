import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Starts a new page at the top. Not on Back/Forward (the browser restores the scroll position
// there) and not when only the query changes, like turning a database page.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const type = useNavigationType()
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (type !== 'POP') window.scrollTo(0, 0)
  }, [pathname, type])

  return null
}
