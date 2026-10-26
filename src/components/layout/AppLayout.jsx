import { Outlet } from 'react-router-dom'
import SpriteBackground from './SpriteBackground'

/*
 * Wraps every page. The sprite background lives here, not in each page, so it keeps
 * drifting when you move between pages instead of restarting.
 *
 * Layering: this wrapper paints the dark page color, the background sits above it
 * (z-0) and each page's content is `relative z-10` so it stays on top.
 */
export default function AppLayout() {
  return (
    <div className="isolate min-h-screen bg-page">
      <SpriteBackground />
      <Outlet />
    </div>
  )
}
