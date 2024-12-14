"use client";

import { useEffect, useState } from "react";
import { ServiceStatus } from "./service-status";
import { Monitor } from "@/types/monitor";
import { format } from "date-fns";

export function UptimeMonitor() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/monitors");
      if (!response.ok) {
        throw new Error("Failed to fetch monitors");
      }
      const data = await response.json();
      // Only add missing required fields, preserve existing names
      const monitorsWithDefaults = data.monitors.map((monitor: Monitor, index: number) => ({
        ...monitor,
        id: monitor.id || `monitor-${index}`,
        type: monitor.type || 'http',
        lastCheck: monitor.lastCheck || new Date().toISOString()
      }));
      setMonitors(monitorsWithDefaults);
      setLastUpdate(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch monitors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    // Refresh every minute
    const interval = setInterval(fetchMonitors, 60000);
    return () => clearInterval(interval);
  }, []);

  // Only render the last update time if it exists (after first client-side update)
  const lastUpdateText = lastUpdate
    ? `Last updated ${format(lastUpdate, "HH:mm:ss")}`
    : "Updating...";

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading monitors
            </h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button
                type="button"
                onClick={fetchMonitors}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderButton = () => {
    if (loading) {
      return (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Refreshing...
        </div>
      );
    }
    return "Refresh";
  };

  const renderContent = () => {
    if (loading && monitors.length === 0) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
          </div>
        </div>
      ));
    }

    console.log('Monitors:', monitors.map(monitor => monitor.id)); // Debugging line to check for unique IDs
    return monitors.map((monitor, index) => {
      console.log('Monitor Data:', monitor); // Debugging line to check monitor data
      return (
        <ServiceStatus
          key={`${monitor.id}-${index}`} // Combine id and index for a unique key
          name={monitor.name}
          status={monitor.status}
          uptime={monitor.uptime}
          lastCheck={monitor.lastCheck}
          history={monitor.history}
        />
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          <p className="text-sm text-gray-500">{lastUpdateText}</p>
        </div>
        <button
          onClick={fetchMonitors}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {renderButton()}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {renderContent()}
      </div>
    </div>
  );
}
