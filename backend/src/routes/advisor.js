const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock advisor database
const mockAdvisors = [
  {
    id: 'adv_001',
    name: 'John Smith',
    credentials: ['CFP', 'CFA'],
    registration: 'SEC123456',
    status: 'active',
    verified: true,
    specializations: ['Retirement Planning', 'Tax Planning'],
    yearsExperience: 15,
    cleanRecord: true
  },
  {
    id: 'adv_002',
    name: 'Sarah Johnson',
    credentials: ['CFP'],
    registration: 'FINRA789012',
    status: 'active',
    verified: true,
    specializations: ['Estate Planning', 'Investment Management'],
    yearsExperience: 12,
    cleanRecord: true
  },
  {
    id: 'adv_003',
    name: 'Mike Williams',
    credentials: [],
    registration: 'UNREGISTERED',
    status: 'unknown',
    verified: false,
    specializations: [],
    yearsExperience: 0,
    cleanRecord: false
  }
];

// GET /api/advisor/:id - Get advisor details
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const advisor = mockAdvisors.find(a => a.id === id);
    
    if (!advisor) {
      return res.status(404).json({
        error: 'Advisor not found'
      });
    }
    
    res.json({
      success: true,
      data: advisor
    });
    
  } catch (error) {
    console.error('Error getting advisor:', error);
    res.status(500).json({
      error: 'Failed to get advisor details',
      message: error.message
    });
  }
});

// POST /api/advisor/verify - Verify advisor credentials
router.post('/verify', async (req, res) => {
  try {
    const { name, registration, credentials } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Advisor name is required'
      });
    }
    
    console.log(`🔍 Verifying advisor: ${name}`);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification logic
    const isRegistered = registration && registration !== 'UNREGISTERED';
    const hasCredentials = credentials && credentials.length > 0;
    const verified = isRegistered && hasCredentials;
    
    const verificationResult = {
      id: uuidv4(),
      advisorName: name,
      verified,
      registrationStatus: isRegistered ? 'registered' : 'unregistered',
      credentialsVerified: hasCredentials,
      regulatoryChecks: {
        sec: isRegistered ? 'passed' : 'failed',
        finra: isRegistered ? 'passed' : 'failed',
        state: 'passed'
      },
      riskScore: verified ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 70) + 30,
      timestamp: new Date().toISOString(),
      recommendations: verified ? 
        ['Advisor appears legitimate', 'Credentials verified'] : 
        ['Exercise extreme caution', 'Unverified credentials', 'Consider alternative advisors']
    };
    
    res.json({
      success: true,
      data: verificationResult,
      message: 'Advisor verification completed'
    });
    
  } catch (error) {
    console.error('Error verifying advisor:', error);
    res.status(500).json({
      error: 'Failed to verify advisor',
      message: error.message
    });
  }
});

// GET /api/advisor/search - Search advisors
router.get('/search', (req, res) => {
  try {
    const { q, verified, specialization } = req.query;
    
    let results = [...mockAdvisors];
    
    // Filter by search query
    if (q) {
      results = results.filter(advisor => 
        advisor.name.toLowerCase().includes(q.toLowerCase()) ||
        advisor.specializations.some(s => s.toLowerCase().includes(q.toLowerCase()))
      );
    }
    
    // Filter by verification status
    if (verified !== undefined) {
      const isVerified = verified === 'true';
      results = results.filter(advisor => advisor.verified === isVerified);
    }
    
    // Filter by specialization
    if (specialization) {
      results = results.filter(advisor => 
        advisor.specializations.some(s => s.toLowerCase().includes(specialization.toLowerCase()))
      );
    }
    
    res.json({
      success: true,
      data: {
        advisors: results,
        total: results.length,
        query: { q, verified, specialization }
      }
    });
    
  } catch (error) {
    console.error('Error searching advisors:', error);
    res.status(500).json({
      error: 'Failed to search advisors',
      message: error.message
    });
  }
});

// GET /api/advisor/regulatory/:registration - Check regulatory status
router.get('/regulatory/:registration', (req, res) => {
  try {
    const { registration } = req.params;
    
    // Mock regulatory check
    const regulatoryStatus = {
      registration,
      status: registration === 'UNREGISTERED' ? 'not_found' : 'active',
      lastUpdated: new Date().toISOString(),
      sanctions: registration === 'UNREGISTERED' ? ['unregistered_advisor'] : [],
      compliance: registration === 'UNREGISTERED' ? 'non_compliant' : 'compliant'
    };
    
    res.json({
      success: true,
      data: regulatoryStatus
    });
    
  } catch (error) {
    console.error('Error checking regulatory status:', error);
    res.status(500).json({
      error: 'Failed to check regulatory status',
      message: error.message
    });
  }
});

module.exports = router;
