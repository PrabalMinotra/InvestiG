import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Shield, Clock, FileText, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FraudAlert } from '../hooks/use-realtime-alerts';

interface AlertDetailsModalProps {
  alert: FraudAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkHighPriority?: (alertId: string) => void;
}

const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({ alert, isOpen, onClose, onMarkHighPriority }) => {
  if (!alert) return null;

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
    return new Date(timestamp).toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Fraud Alert Details</h2>
                  <p className="text-sm text-gray-500">Alert ID: {alert.id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Company & Alert Type */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{alert.company}</CardTitle>
                      <CardDescription>{alert.description}</CardDescription>
                    </div>
                    <Badge variant={getAlertTypeColor(alert.alert_type) as any}>
                      {alert.alert_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>Credibility Score</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getCredibilityColor(alert.credibility_score).replace('text-', 'bg-')}`}
                            style={{ width: `${alert.credibility_score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getCredibilityColor(alert.credibility_score)}`}>
                          {alert.credibility_score}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Detected</span>
                      </div>
                      <p className="text-sm font-medium">{formatTimestamp(alert.timestamp)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <span>Risk Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Patterns Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.details.patterns_detected.map((pattern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pattern.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.details.risk_factors.map((factor, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {factor.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Source & Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span>Source & Recommendation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Detection Source</h4>
                    <p className="text-sm text-gray-600">{alert.details.source}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                    <p className="text-sm text-gray-600">{alert.details.recommendation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (onMarkHighPriority && alert) {
                      onMarkHighPriority(alert.id);
                      onClose();
                    }
                  }}
                >
                  Mark as High Priority
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertDetailsModal;
