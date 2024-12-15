"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MonitorGrid } from '@/components/monitors/monitor-grid'
import { StatusOverview } from '@/components/status/status-overview'
import { useMonitors } from '@/hooks/use-monitors'

export default function Home() {
  const { monitors } = useMonitors()
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString())
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (    
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Status Overview */}
        <div className="mb-12">
          <StatusOverview 
            monitors={monitors} 
            lastUpdated={currentTime}
          />
        </div>

        {/* Monitors */}
        <div className="space-y-12">
          <section>
            <MonitorGrid />
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Incident History</h2>
              <p className="text-sm text-muted-foreground">
                Recent system incidents and their resolutions
              </p>
            </div>
            <div className="rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 bg-card/50 ring-1 ring-border/50 p-8 hover:shadow-xl hover:bg-card/60">
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">
                  No incidents reported in the last 90 days ✨
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}