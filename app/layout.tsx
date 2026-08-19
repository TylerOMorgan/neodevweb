import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeoDev Studio — Digital products that move businesses forward',
  description:
    'NeoDev Studio builds premium websites, apps, AI automations and visual systems for ambitious businesses.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
