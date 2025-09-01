import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, X, Eye, Clock, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useRealtimeAlerts, FraudAlert } from '../hooks/use-realtime-alerts';
import { useToast } from '../hooks/use-toast';
import AlertDetailsModal from './AlertDetailsModal';

const RealTimeAlerts: React.FC = () => {
  const { newAlerts, isLoading, error, lastUpdate, markAlertAsRead, clearNewAlerts, markAlertAsHighPriority } = useRealtimeAlerts(10000);
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);

  // Show toast notifications for new alerts
  useEffect(() => {
    newAlerts.forEach(alert => {
      if (alert.is_new) {
        toast({
          title: `🚨 ${alert.alert_type} stock tip detected!`,
          description: `${alert.company} with ${alert.credibility_score}% credibility score.`,
          variant: alert.alert_type === 'Suspicious' || alert.alert_type === 'High Risk' ? 'destructive' : 'warning',
          duration: 8000,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAlert(alert);
                setIsModalOpen(true);
                markAlertAsRead(alert.id);
              }}
              className="ml-2 bg-black text-gray-900 border-gray-300 hover:bg-gray-50"
            >
              View Details
            </Button>
          ),
        });
      }
    });
  }, [newAlerts, toast, markAlertAsRead]);

  const handleAlertClick = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
    markAlertAsRead(alert.id);
  };

  const getAlertTypeColor = (alertType: string) => {
    switch (alertType) {
      case 'Suspicious': return 'destructive';
      case 'Warning': return 'warning';
      case 'High Risk': return 'destructive';
      default: return 'outline';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Alert Bell Icon with Badge */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAlertsPanel(!showAlertsPanel)}
          className="relative p-2"
        >
          <Bell className="h-5 w-5" />
          {newAlerts.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {newAlerts.length > 9 ? '9+' : newAlerts.length}
            </motion.div>
          )}
        </Button>

        {/* Alerts Panel */}
        <AnimatePresence>
          {showAlertsPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900">Real-time Alerts</h3>
                  {newAlerts.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {newAlerts.length}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {newAlerts.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearNewAlerts}
                      className="h-6 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAlertsPanel(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Alerts List */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
                    Loading alerts...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                    Failed to load alerts
                  </div>
                ) : newAlerts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="h-6 w-6 mx-auto mb-2" />
                    No new alerts
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {newAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-red-500"
                        onClick={() => handleAlertClick(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={getAlertTypeColor(alert.alert_type) as any} className="text-xs">
                                {alert.alert_type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.timestamp)}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {alert.company}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {alert.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-gray-400" />
                                <span className={`text-xs font-medium ${getCredibilityColor(alert.credibility_score)}`}>
                                  {alert.credibility_score}%
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">Click to view details</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAlertAsRead(alert.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {lastUpdate && (
                <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert Details Modal */}
      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        onMarkHighPriority={markAlertAsHighPriority}
      />
    </>
  );
};

export default RealTimeAlerts;
