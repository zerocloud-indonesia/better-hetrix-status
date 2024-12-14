"use client";

import { useState, useEffect } from 'react';
import { UptimeMonitor } from '@/components/uptime-monitor'

type Monitor = {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'unknown';
  uptime: number;
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [monitors, setMonitors] = useState<Monitor[]>([]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await fetch("/api/monitors");
        if (!response.ok) throw new Error("Failed to fetch monitors");
        const data = await response.json();
        setMonitors(data.monitors);
      } catch (error) {
        console.error("Error fetching monitors:", error);
      }
    };
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSystemStatus = () => {
    if (monitors.length === 0) return { status: 'unknown', text: 'Loading status...' };
    
    const downMonitors = monitors.filter(m => m.status === 'down').length;
    const degradedMonitors = monitors.filter(m => m.status === 'degraded').length;
    
    if (downMonitors > 0) {
      return {
        status: 'down',
        text: `${downMonitors} system${downMonitors > 1 ? 's' : ''} down`,
        color: 'bg-red-500',
        ring: 'ring-red-500/20'
      };
    }
    if (degradedMonitors > 0) {
      return {
        status: 'degraded',
        text: `${degradedMonitors} system${degradedMonitors > 1 ? 's' : ''} degraded`,
        color: 'bg-yellow-500',
        ring: 'ring-yellow-500/20'
      };
    }
    return {
      status: 'operational',
      text: 'All systems operational',
      color: 'bg-green-500',
      ring: 'ring-green-500/20'
    };
  };

  const systemStatus = getSystemStatus();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (    
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`border-b ${darkMode ? 'border-gray-700/50 bg-gray-800/80' : 'border-gray-100 bg-white/80'} backdrop-blur-md sticky top-0 z-10 transition-all duration-300`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25" />
            <span className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-300`}>Status</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Status Overview */}
        <div className={`mb-16 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/50 ring-1 ring-gray-700/50' 
            : 'bg-white/50 ring-1 ring-gray-200/50'
        } p-8`}>
          <div className="flex items-center gap-4">
            <div className={`h-5 w-5 rounded-full shadow-lg animate-pulse ring-4 ${systemStatus.color} ${systemStatus.ring}`} />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>
              {systemStatus.text}
            </h1>
          </div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
            Last updated {currentTime}
          </p>
        </div>

        {/* Monitors */}
        <div className="space-y-16">
          <section>
            <h2 className={`mb-6 text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-300`}>Monitors</h2>
            <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 ring-1 ring-gray-700/50' 
                : 'bg-white/50 ring-1 ring-gray-200/50'
            } p-8`}>
              <UptimeMonitor />
            </div>
          </section>

          <section>
            <h2 className={`mb-6 text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-300`}>Incident History</h2>
            <div className={`rounded-2xl shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 ring-1 ring-gray-700/50' 
                : 'bg-white/50 ring-1 ring-gray-200/50'
            } p-8`}>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>No incidents reported.</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t transition-all duration-300 ${
        darkMode 
          ? 'border-gray-700/50 bg-gray-800/80' 
          : 'border-gray-100 bg-white/80'
      } backdrop-blur-md`}>
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between text-lg">
            <div className={`transition-all duration-300 ${
              darkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-600 hover:text-blue-600'
            }`}>
              Powered by Hetrix Tools
            </div>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
