import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'

let initialized = false

export function initAnalytics() {
  if (initialized) return
  initialized = true

  const posthogKey = import.meta.env.VITE_POSTHOG_KEY
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: import.meta.env.VITE_POSTHOG_HOST ?? 'https://app.posthog.com',
      capture_pageview: true,
      loaded: () => {
        posthog.identify()
      },
    })
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.PROD ? 'production' : 'development',
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.1,
    })
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  try {
    posthog.capture(event, properties)
  } catch {
    // Silently fail — analytics should never break the app
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized) return
  try {
    posthog.identify(userId, traits)
    Sentry.setUser({ id: userId })
  } catch {
    // Silently fail
  }
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  try {
    sentryCaptureException(error, context)
  } catch {
    // Silently fail
  }
}

function sentryCaptureException(error: Error, context?: Record<string, unknown>) {
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context)
    Sentry.captureException(error)
  })
}
