import { Geist } from 'next/font/google'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { createClient } from '@/utils/supabase/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TRVLR',
  description: 'A clan management platform for Destiny 2',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
