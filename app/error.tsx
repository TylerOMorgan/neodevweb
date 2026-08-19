'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isProd = process.env.NODE_ENV === 'production'

  return (
    <main className="container section-pad" style={{ textAlign: 'center' }}>
      <div className="section-kicker">Something broke</div>
      <h2 style={{ marginTop: 12 }}>We hit a snag loading this view.</h2>
      <p style={{ maxWidth: 520, margin: '12px auto 24px', color: 'var(--muted)' }}>
        {isProd
          ? 'Please try again in a moment.'
          : error.message}
      </p>
      <button type="button" className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  )
}
