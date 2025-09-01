import { useState, useEffect, useCallback, useRef } from 'react';

export interface FraudAlert {
  id: string;
  company: string;
  alert_type: 'Suspicious' | 'Warning' | 'High Risk';
  credibility_score: number;
  description: string;
  details: {
    source: string;
    patterns_detected: string[];
    risk_factors: string[];
    recommendation: string;
  };
  timestamp: string;
  is_new: boolean;
}

interface AlertsResponse {
  alerts: FraudAlert[];
  total_count: number;
  new_alerts: number;
  timestamp: string;
}

export const useRealtimeAlerts = (pollingInterval: number = 10000) => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [newAlerts, setNewAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const previousAlertsRef = useRef<FraudAlert[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8001/alerts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AlertsResponse = await response.json();
      
      // Check for new alerts by comparing with previous state
      const previousIds = new Set(previousAlertsRef.current.map(alert => alert.id));
      const newAlertsFound = data.alerts.filter(alert => !previousIds.has(alert.id));
      
      if (newAlertsFound.length > 0) {
        setNewAlerts(prev => [...newAlertsFound, ...prev].slice(0, 10)); // Keep last 10 new alerts
      }
      
      setAlerts(data.alerts);
      setLastUpdate(new Date());
      previousAlertsRef.current = data.alerts;
      
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Fetch immediately
    fetchAlerts();
    
    // Then set up polling
    intervalRef.current = setInterval(fetchAlerts, pollingInterval);
  }, [fetchAlerts, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearNewAlerts = useCallback(() => {
    setNewAlerts([]);
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setNewAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const markAlertAsHighPriority = useCallback(async (alertId: string) => {
    try {
      // Update the alert in the local state to mark it as high priority
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, alert_type: 'High Risk' as const }
          : alert
      ));
      
      // Also update in new alerts if it exists there
      setNewAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, alert_type: 'High Risk' as const }
          : alert
      ));
      
      // In a real application, you would also send this to the backend
      console.log(`Alert ${alertId} marked as high priority`);
      
      // Optional: Send to backend (uncomment when backend endpoint is ready)
      // await fetch(`http://localhost:8001/alerts/${alertId}/priority`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priority: 'high' })
      // });
      
    } catch (error) {
      console.error('Failed to mark alert as high priority:', error);
    }
  }, []);

  useEffect(() => {
    startPolling();
    
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return {
    alerts,
    newAlerts,
    isLoading,
    error,
    lastUpdate,
    fetchAlerts,
    startPolling,
    stopPolling,
    clearNewAlerts,
    markAlertAsRead,
    markAlertAsHighPriority,
  };
};
