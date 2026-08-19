'use client'

import { Lottie, type LottieHandle } from 'lottie-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type NeoTint = 'original' | 'brand' | 'magenta' | 'mono' | 'cool'

const tintToFilter: Record<NeoTint, string> = {
  original: 'none',
  brand:
    'hue-rotate(-12deg) saturate(1.18) brightness(1.04) contrast(1.06)',
  magenta:
    'hue-rotate(-32deg) saturate(1.25) brightness(1.06)',
  mono: 'saturate(0.55) hue-rotate(-8deg) brightness(0.95) contrast(1.05)',
  cool: 'hue-rotate(28deg) saturate(1.1) brightness(1.04)',
}

const ANIMATION_URL = '/neodevweb/lottie/neodev-hero.json'

const EXPECTED_SHA256 =
  '0b9da2bd58ad1b19e1b3eaad09755a8e68838e66d037d0e4b3d637c0f9a3c62b'

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; data: object }
  | { status: 'error' }

let cachedLoad: Promise<{ data: object }> | null = null

async function fetchVerifiedAnimation(): Promise<{ data: object }> {
  if (cachedLoad) return cachedLoad
  cachedLoad = (async () => {
    const res = await fetch(ANIMATION_URL, { cache: 'force-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    const digest = await crypto.subtle.digest('SHA-256', buf)
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    if (hex !== EXPECTED_SHA256) {
      cachedLoad = null
      throw new Error('Animation integrity check failed')
    }
    const text = new TextDecoder().decode(buf)
    const data: unknown = JSON.parse(text)
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new Error('Animation payload is not an object')
    }
    return { data: data as object }
  })().catch((err) => {
    cachedLoad = null
    throw err
  })
  return cachedLoad
}

interface NeoHeroArtProps {
  tint?: NeoTint
  speed?: number
  paused?: boolean
  className?: string
}

export default function NeoHeroArt({
  tint = 'brand',
  speed = 0.7,
  paused = false,
  className = '',
}: NeoHeroArtProps) {
  const ref = useRef<LottieHandle>(null)
  const [load, setLoad] = useState<LoadState>({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setLoad({ status: 'loading' })
    fetchVerifiedAnimation()
      .then((result) => {
        if (!cancelled) setLoad({ status: 'ok', data: result.data })
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('NeoHeroArt load failed:', err)
          setLoad({ status: 'error' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ref.current) return
    ref.current.setSpeed(speed)
  }, [speed])

  useEffect(() => {
    if (!ref.current) return
    if (paused) ref.current.pause()
    else ref.current.play()
  }, [paused])

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      maxWidth: 560,
      margin: '0 auto',
      aspectRatio: '1 / 1',
      display: 'grid',
      placeItems: 'center',
      filter: tintToFilter[tint],
      position: 'relative' as const,
    }),
    [tint],
  )

  return (
    <div
      className={`neo-hero-art ${className}`}
      style={containerStyle}
      role="img"
      aria-label="NeoDev digital systems illustration"
    >
      {load.status !== 'ok' && (
        <div
          className="neo-hero-skeleton"
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(139,77,255,0.18) 0%, rgba(139,77,255,0.04) 50%, transparent 75%)',
            animation: 'neoHeroPulse 1.8s ease-in-out infinite',
          }}
        />
      )}

      {load.status === 'ok' && (
        <div style={{ width: '100%', height: '100%' }}>
          <Lottie
            lottieRef={ref}
            src={load.data}
            loop
            autoplay
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      )}

      {load.status === 'error' && (
        <noscript>
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>
            Hero illustration failed to load.
          </p>
        </noscript>
      )}

      <style>{`
        @keyframes neoHeroPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
