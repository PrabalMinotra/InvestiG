import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Shield, TrendingUp, Users, FileText, Calendar, Globe, Filter, Search, Eye, EyeOff, X } from 'lucide-react';
import RealTimeAlerts from '../components/RealTimeAlerts';
import ThemeToggle from '../components/ThemeToggle';
import { useRealtimeAlerts, FraudAlert } from '../hooks/use-realtime-alerts';

// Mock data
const mockFlaggedAnnouncements = [
  { id: 1, source: "StockTips Daily", date: "2024-01-15", alertType: "Fraud", credibilityScore: 15, status: "Under Review", language: "English", description: "Suspicious pump and dump scheme" },
  { id: 2, source: "Investor Forum", date: "2024-01-14", alertType: "Misinformation", credibilityScore: 28, status: "Flagged", language: "English", description: "False claims about earnings" },
  { id: 3, source: "Trading Signals Pro", date: "2024-01-13", alertType: "Deepfake", credibilityScore: 8, status: "Confirmed", language: "English", description: "AI-generated fake CEO interview" },
  { id: 4, source: "Market Insights", date: "2024-01-12", alertType: "Fraud", credibilityScore: 22, status: "Under Review", language: "Spanish", description: "Phony investment opportunity" },
  { id: 5, source: "Crypto News", date: "2024-01-11", alertType: "Misinformation", credibilityScore: 35, status: "Flagged", language: "English", description: "Exaggerated crypto claims" }
];

const mockFraudAlertsData = [
  { date: '2024-01-01', fraud: 5, misinformation: 8, deepfake: 2 },
  { date: '2024-01-02', fraud: 3, misinformation: 6, deepfake: 1 },
  { date: '2024-01-03', fraud: 7, misinformation: 4, deepfake: 3 },
  { date: '2024-01-04', fraud: 4, misinformation: 9, deepfake: 2 },
  { date: '2024-01-05', fraud: 6, misinformation: 5, deepfake: 1 }
];

const mockAlertTypeData = [
  { name: 'Fraud', value: 35, color: '#ef4444' },
  { name: 'Misinformation', value: 45, color: '#f59e0b' },
  { name: 'Deepfake', value: 20, color: '#8b5cf6' }
];

const RegulatorDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'user' | 'regulator'>('regulator');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertTypeFilter, setAlertTypeFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<FraudAlert | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Use real alerts data
  const { alerts, markAlertAsHighPriority } = useRealtimeAlerts(10000);

  const filteredAnnouncements = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAlertType = alertTypeFilter === 'all' || alert.alert_type === alertTypeFilter;
      // Note: Language filter removed since real alerts don't have language field
      return matchesSearch && matchesAlertType;
    });
  }, [alerts, searchTerm, alertTypeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'destructive';
      case 'Under Review': return 'secondary';
      case 'Flagged': return 'default';
      default: return 'outline';
    }
  };

  const getAlertTypeColor = (alertType: string) => {
    switch (alertType) {
      case 'Fraud': return 'destructive';
      case 'Misinformation': return 'warning';
      case 'Deepfake': return 'secondary';
      default: return 'outline';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleReview = (alert: FraudAlert) => {
    // In a real application, this would open a review form or workflow
    console.log('Reviewing alert:', alert);
    alert(`Review initiated for ${alert.company}. This would open a review workflow in a real application.`);
  };

  const handleDetails = (alert: FraudAlert) => {
    setSelectedAnnouncement(alert);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InvestiGuard</h1>
                <p className="text-sm text-gray-500">Regulator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <RealTimeAlerts />
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'user' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('user')}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>User View</span>
                </Button>
                <Button
                  variant={viewMode === 'regulator' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('regulator')}
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Regulator View</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">All time alerts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <Shield className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {alerts.filter(a => a.alert_type === 'High Risk').length}
                </div>
                <p className="text-xs text-muted-foreground">Critical alerts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {alerts.filter(a => a.is_new).length}
                </div>
                <p className="text-xs text-muted-foreground">Unreviewed alerts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => !a.is_new).length}
                </div>
                <p className="text-xs text-muted-foreground">Processed alerts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Fraud Alerts Over Time</CardTitle>
                <CardDescription>Daily trend of different alert types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockFraudAlertsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} name="Fraud" />
                    <Line type="monotone" dataKey="misinformation" stroke="#f59e0b" strokeWidth={2} name="Misinformation" />
                    <Line type="monotone" dataKey="deepfake" stroke="#8b5cf6" strokeWidth={2} name="Deepfake" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Alert Type Distribution</CardTitle>
                <CardDescription>Breakdown of current alert types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAlertTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockAlertTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <CardTitle>Filters & Search</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search sources or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Type</label>
                    <Select value={alertTypeFilter} onValueChange={setAlertTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Fraud">Fraud</SelectItem>
                        <SelectItem value="Misinformation">Misinformation</SelectItem>
                        <SelectItem value="Deepfake">Deepfake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Flagged Announcements Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Alerts</CardTitle>
              <CardDescription>
                {filteredAnnouncements.length} of {alerts.length} alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Credibility Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{alert.company}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {alert.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAlertTypeColor(alert.alert_type) as any}>
                            {alert.alert_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getCredibilityColor(alert.credibility_score).replace('text-', 'bg-')}`}
                                style={{ width: `${alert.credibility_score}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getCredibilityColor(alert.credibility_score)}`}>
                              {alert.credibility_score}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {alert.is_new ? 'New' : 'Reviewed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReview(alert)}
                            >
                              Review
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDetails(alert)}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Announcement Details</h2>
                  <p className="text-sm text-gray-500">Source: {selectedAnnouncement.source}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAnnouncement(null);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAnnouncement.company}</CardTitle>
                  <CardDescription>{selectedAnnouncement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Alert Type</h4>
                      <Badge variant={getAlertTypeColor(selectedAnnouncement.alert_type) as any}>
                        {selectedAnnouncement.alert_type}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                      <Badge variant="secondary">
                        {selectedAnnouncement.is_new ? 'New' : 'Reviewed'}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Credibility Score</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getCredibilityColor(selectedAnnouncement.credibility_score).replace('text-', 'bg-')}`}
                            style={{ width: `${selectedAnnouncement.credibility_score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getCredibilityColor(selectedAnnouncement.credibility_score)}`}>
                          {selectedAnnouncement.credibility_score}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Date</h4>
                      <span className="text-sm text-gray-600">{new Date(selectedAnnouncement.timestamp).toLocaleString()}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">ID</h4>
                      <span className="text-sm text-gray-600">#{selectedAnnouncement.id}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Source</h4>
                      <span className="text-sm text-gray-600">{selectedAnnouncement.details.source}</span>
                    </div>
                  </div>
                  
                  {/* Risk Analysis */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Patterns Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnnouncement.details.patterns_detected.map((pattern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {pattern.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnnouncement.details.risk_factors.map((factor, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {factor.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                      <p className="text-sm text-gray-600">{selectedAnnouncement.details.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAnnouncement(null);
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (selectedAnnouncement) {
                      markAlertAsHighPriority(selectedAnnouncement.id);
                      setShowDetailsModal(false);
                      setSelectedAnnouncement(null);
                    }
                  }}
                >
                  Mark as High Priority
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorDashboard;
