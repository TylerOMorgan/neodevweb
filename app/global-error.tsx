'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#0b0713',
          color: '#f3eefc',
        }}
      >
        <main style={{ textAlign: 'center', padding: '24px', maxWidth: 520 }}>
          <h1 style={{ fontSize: 28, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            Site is unavailable
          </h1>
          <p style={{ color: '#9d94ae', margin: '0 0 24px' }}>
            A critical error prevented the page from loading. Please refresh.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 20px',
              borderRadius: 999,
              border: 0,
              background: 'linear-gradient(135deg,#8b4dff,#a86aff)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  )
}
