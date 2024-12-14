"use client"

import { useState, useEffect } from "react"
import { Monitor } from "@/types/monitor"

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMonitors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/monitors")
      if (!response.ok) throw new Error("Failed to fetch monitors")
      const data = await response.json()
      setMonitors(data.monitors)
      localStorage.setItem('monitors', JSON.stringify(data.monitors))
    } catch (err) {
      setError("Failed to fetch monitors")
      const cached = localStorage.getItem('monitors')
      if (cached) setMonitors(JSON.parse(cached))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cached = localStorage.getItem('monitors')
    if (cached) setMonitors(JSON.parse(cached))
    fetchMonitors()
    const interval = setInterval(fetchMonitors, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    monitors,
    loading,
    error,
    refresh: fetchMonitors
  }
}