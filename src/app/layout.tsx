import '@/app/globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { EnvProvider } from '@/providers/env-provider'
import { env } from '@/utils/env'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  // Include all the weights you need
  weight: ['300', '400', '500', '600', '700'],
  // Optional: you can add display: 'swap' for better performance
  display: 'swap',
})

export const metadata = {
  title: 'Service Status',
  description: 'Monitor your service uptime and incidents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakartaSans.className}>
        <EnvProvider
          showSystemStats={env.showSystemStats}
          showCpuStats={env.showCpuStats}
          showRamStats={env.showRamStats}
          showDiskStats={env.showDiskStats}
          showNetworkStats={env.showNetworkStats}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </EnvProvider>
      </body>
    </html>
  )
}