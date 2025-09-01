const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock reports database
const mockReports = [];

// GET /api/reports/:id - Get analysis report
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const report = mockReports.find(r => r.id === id);
    
    if (!report) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }
    
    res.json({
      success: true,
      data: report
    });
    
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({
      error: 'Failed to get report',
      message: error.message
    });
  }
});

// GET /api/reports/history - Get user's report history
router.get('/history', (req, res) => {
  try {
    const { limit = 10, offset = 0, type } = req.query;
    
    let results = [...mockReports];
    
    // Filter by type if specified
    if (type) {
      results = results.filter(report => report.type === type);
    }
    
    // Apply pagination
    const paginatedResults = results.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        reports: paginatedResults,
        total: results.length,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < results.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error getting report history:', error);
    res.status(500).json({
      error: 'Failed to get report history',
      message: error.message
    });
  }
});

// POST /api/reports/export - Export report data
router.post('/export', (req, res) => {
  try {
    const { reportIds, format = 'json' } = req.body;
    
    if (!reportIds || !Array.isArray(reportIds)) {
      return res.status(400).json({
        error: 'Report IDs array is required'
      });
    }
    
    // Find the requested reports
    const reports = mockReports.filter(report => reportIds.includes(report.id));
    
    if (reports.length === 0) {
      return res.status(404).json({
        error: 'No reports found for the specified IDs'
      });
    }
    
    // Mock export process
    const exportData = {
      exportId: uuidv4(),
      format,
      reportCount: reports.length,
      timestamp: new Date().toISOString(),
      reports: reports.map(report => ({
        id: report.id,
        type: report.type,
        fraudAlert: report.fraudAlert,
        credibilityScore: report.credibilityScore,
        timestamp: report.timestamp,
        summary: report.analysis.substring(0, 200) + '...'
      }))
    };
    
    res.json({
      success: true,
      data: exportData,
      message: `Export completed successfully. ${reports.length} reports exported.`
    });
    
  } catch (error) {
    console.error('Error exporting reports:', error);
    res.status(500).json({
      error: 'Failed to export reports',
      message: error.message
    });
  }
});

// POST /api/reports/summary - Get summary statistics
router.post('/summary', (req, res) => {
  try {
    const { timeframe = '30d' } = req.body;
    
    // Calculate mock statistics based on timeframe
    const now = new Date();
    const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    const recentReports = mockReports.filter(report => 
      new Date(report.timestamp) >= cutoffDate
    );
    
    const summary = {
      timeframe,
      totalScans: recentReports.length,
      fraudAlerts: {
        safe: recentReports.filter(r => r.fraudAlert === 'safe').length,
        warning: recentReports.filter(r => r.fraudAlert === 'warning').length,
        danger: recentReports.filter(r => r.fraudAlert === 'danger').length
      },
      averageCredibilityScore: recentReports.length > 0 ? 
        Math.round(recentReports.reduce((sum, r) => sum + r.credibilityScore, 0) / recentReports.length) : 0,
      deepfakeDetections: recentReports.filter(r => r.deepfakeDetected).length,
      advisorVerifications: recentReports.filter(r => r.advisorVerified).length,
      riskTrend: 'stable', // Mock trend analysis
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: summary
    });
    
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({
      error: 'Failed to get summary',
      message: error.message
    });
  }
});

module.exports = router;
