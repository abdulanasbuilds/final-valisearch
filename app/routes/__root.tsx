import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  HeadContent,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { initAnalytics } from '@/lib/analytics'
import { useEffect } from 'react'

interface User {
  id: string
}

interface RouterContext {
  user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: 'ValiSearch — AI Startup Intelligence' },
      { name: 'description', content: 'Validate your startup idea with 12 AI agents in 60 seconds.' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  useEffect(() => { initAnalytics() }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white text-[#0C0D0E] font-sans antialiased">
        <Outlet />
        <ScrollRestoration />
        {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
      </body>
    </html>
  )
}
