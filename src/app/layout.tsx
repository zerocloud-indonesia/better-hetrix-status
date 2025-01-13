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
  title: 'ZeroCloud Status Page',
  description: 'Welcome to the ZeroCloud Status Page. Here you can monitor the uptime and performance of our services, track incidents, and stay informed about any issues affecting our platform. We are committed to providing reliable and transparent service status updates to ensure you are always in the loop.',
  themeColor: '#49A0E8', // Blue color
  image: '/banner_1.gif', // Add the path to your gif image
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