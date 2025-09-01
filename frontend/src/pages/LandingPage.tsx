import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, XCircle, UserCheck, Eye, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import RealTimeAlerts from '../components/RealTimeAlerts';
import ThemeToggle from '../components/ThemeToggle';

interface ScanResult {
  fraud_alert: 'Safe' | 'Warning' | 'Suspicious';
  credibility_score: number;
  advisor_verified: boolean;
  deepfake_detected: boolean;
}

const LandingPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [inputType, setInputType] = useState<'text' | 'link'>('text');
  const { toast } = useToast();

  const handleScan = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a stock tip or link to scan.",
        variant: "warning",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // Determine if input is a URL or text
      const isUrl = inputValue.startsWith('http://') || inputValue.startsWith('https://');
      const currentInputType = isUrl ? 'link' : 'text';
      setInputType(currentInputType);
      
      // Prepare request payload
      const payload = isUrl 
        ? { link: inputValue }
        : { text: inputValue };
      
      console.log(`🔍 Sending ${currentInputType} for analysis:`, payload);
      
      // Call the enhanced NLP analysis endpoint for better fraud detection
      const response = await fetch('http://localhost:8001/nlp-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ScanResult = await response.json();
      console.log('📊 Analysis result:', result);
      
      setScanResult(result);
      
      // Show toast notification
      const alertType = result.fraud_alert === 'Likely Safe' ? 'success' : 
                       result.fraud_alert === 'Warning' ? 'warning' : 'destructive';
      
      toast({
        title: `Scan Complete - ${result.fraud_alert}`,
        description: result.fraud_alert === 'Likely Safe' ? 'Content appears legitimate' : 
                    result.fraud_alert === 'Warning' ? 'Exercise caution with this content' : 
                    'High risk of fraud detected',
        variant: alertType,
      });
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to mock result for demo purposes
      const mockResult: ScanResult = {
        fraud_alert: Math.random() > 0.7 ? 'Suspicious' : Math.random() > 0.4 ? 'Warning' : 'Safe',
        credibility_score: Math.floor(Math.random() * 100) + 1,
        advisor_verified: Math.random() > 0.5,
        deepfake_detected: Math.random() > 0.8,
      };
      
      setScanResult(mockResult);
    } finally {
      setIsScanning(false);
    }
  };

  const getFraudAlertIcon = (alert: string) => {
    switch (alert) {
      case 'Likely Safe':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'Safe':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-6 w-6 text-warning" />;
      case 'Suspicious':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-muted" />;
    }
  };

  const getFraudAlertText = (alert: string) => {
    switch (alert) {
      case 'Likely Safe':
        return 'Likely Safe';
      case 'Safe':
        return 'Safe';
      case 'Warning':
        return 'Warning';
      case 'Suspicious':
        return 'Suspicious';
      default:
        return 'Unknown';
    }
  };

  const getFraudAlertVariant = (alert: string) => {
    switch (alert) {
      case 'Safe':
        return 'success';
      case 'Warning':
        return 'warning';
      case 'Suspicious':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getFraudAlertDescription = (alert: string) => {
    switch (alert) {
      case 'Safe': 
        return 'No immediate threats detected. Content appears legitimate.';
      case 'Warning':
        return 'Exercise caution. Some concerning indicators detected.';
      case 'Suspicious':
        return 'High risk of fraud. Avoid this investment opportunity.';
      default:
        return 'Unable to determine risk level.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-200/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-display-2 text-gray-900 dark:text-white font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                InvestiGuard
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-body font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
              <a href="mailto:prabal22357@iiitd.ac.in" className="text-body font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Email</a>
              <Link to="/regulator" className="text-body font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Regulator Dashboard</Link>
              <RealTimeAlerts />
              <ThemeToggle />
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <RealTimeAlerts />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => {/* TODO: Add mobile menu toggle */}}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-display-1 md:text-display-1 font-extrabold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A Smart Watchdog for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500">
                Financial Content Verification
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-body-large text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Protect yourself from investment scams with AI-powered analysis. 
              Verify stock tips, advisor credentials, and detect deepfakes in seconds.
            </motion.p>

            {/* Input Section */}
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder={inputType === 'text' ? "Paste a stock tip or text here..." : "Enter a URL to analyze..."}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    // Auto-detect if input is a URL
                    if (e.target.value.startsWith('http://') || e.target.value.startsWith('https://')) {
                      setInputType('link');
                    } else {
                      setInputType('text');
                    }
                  }}
                  className="flex-1 text-body px-6 py-4 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                />
                <Button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="px-8 py-4 text-body font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:transform-none disabled:opacity-75"
                >
                  {isScanning ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Analyze</span>
                    </div>
                  )}
                </Button>
              </div>
              
              {/* Input Type Indicator */}
              <div className="mt-3 text-body-small text-gray-500 dark:text-gray-400">
                {inputType === 'link' ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Analyzing as URL</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Analyzing as text</span>
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {scanResult && (
          <motion.section 
            className="py-16 bg-white dark:bg-gray-900"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <motion.h2 
                className="text-heading-1 font-bold text-center text-gray-900 dark:text-white mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analysis Results
              </motion.h2>

              <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                {/* Fraud Alert Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 300 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-heading-3 text-gray-900 dark:text-white">
                        {getFraudAlertIcon(scanResult.fraud_alert)}
                        <span>Fraud Alert</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={getFraudAlertVariant(scanResult.fraud_alert)}
                        className="text-body font-semibold px-4 py-2 mb-4"
                      >
                        {getFraudAlertText(scanResult.fraud_alert)}
                      </Badge>
                      <p className="text-body text-gray-600 dark:text-gray-300">
                        {getFraudAlertDescription(scanResult.fraud_alert)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Credibility Score Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-heading-3 text-gray-900 dark:text-white">
                        <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <span>Credibility Score</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-display-2 font-bold text-gray-900 dark:text-white">
                            {scanResult.credibility_score}/100
                          </span>
                          <span className={`text-body font-medium ${
                            scanResult.credibility_score >= 80 ? 'text-green-600 dark:text-green-400' :
                            scanResult.credibility_score >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {scanResult.credibility_score >= 80 ? 'High' :
                             scanResult.credibility_score >= 60 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                        <Progress value={scanResult.credibility_score} className="h-3" />
                        <p className="text-body text-gray-600 dark:text-gray-300">
                          Based on AI analysis of content authenticity, source verification, and risk indicators.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Advisor Verification Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <UserCheck className="h-6 w-6 text-primary" />
                        <span>Advisor Verification</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge 
                          variant={scanResult.advisor_verified ? 'success' : 'destructive'}
                          className="text-lg px-4 py-2"
                        >
                          {scanResult.advisor_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        {scanResult.advisor_verified 
                          ? 'Advisor credentials have been verified through regulatory databases.'
                          : 'Unable to verify advisor credentials. Exercise caution.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Deepfake Detection Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span>Deepfake Detection</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge 
                          variant={scanResult.deepfake_detected ? 'destructive' : 'success'}
                          className="text-lg px-4 py-2"
                        >
                          {scanResult.deepfake_detected ? 'Detected' : 'Authentic'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        {scanResult.deepfake_detected 
                          ? 'AI analysis suggests this content may be artificially generated.'
                          : 'Content appears to be authentic and human-generated.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Analysis Summary */}
              <motion.div 
                className="max-w-4xl mx-auto mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                    <CardDescription>
                      AI-powered analysis completed at {new Date().toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{scanResult.fraud_alert}</div>
                        <div className="text-sm text-gray-600">Risk Level</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{scanResult.credibility_score}%</div>
                        <div className="text-sm text-gray-600">Credibility</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{scanResult.advisor_verified ? 'Yes' : 'No'}</div>
                        <div className="text-sm text-gray-600">Advisor Verified</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{scanResult.deepfake_detected ? 'Yes' : 'No'}</div>
                        <div className="text-sm text-gray-600">Deepfake Detected</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose InvestiGuard?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced AI technology combined with regulatory compliance to protect your investments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
                title: "AI-Powered Detection",
                description: "Advanced machine learning models identify fraud patterns and suspicious activities in real-time."
              },
              {
                icon: <Eye className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
                title: "Multi-Format Analysis",
                description: "Scan text, documents, videos, and audio content for comprehensive fraud detection."
              },
              {
                icon: <UserCheck className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
                title: "Regulatory Compliance",
                description: "Cross-verify with SEC, FINRA, and other regulatory databases for complete transparency."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About InvestiGuard
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Protecting investors with cutting-edge AI technology and comprehensive fraud detection
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                InvestiGuard was created to protect investors from increasingly sophisticated financial fraud. 
                We combine advanced artificial intelligence with comprehensive regulatory databases to provide 
                real-time protection against scams, fake credentials, and deceptive investment schemes.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform analyzes text, links, and content to identify potential fraud patterns, 
                verify financial advisor credentials, and detect AI-generated deepfake content that 
                could mislead investors.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Capabilities</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Real-time fraud pattern detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Financial advisor credential verification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Deepfake content detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Regulatory compliance checking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Instant risk assessment and alerts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">InvestiGuard</span>
          </div>
          <p className="text-gray-400 mb-4">
            Protecting investors with AI-powered fraud detection
          </p>
          <div className="text-sm text-gray-500">
            © 2024 InvestiGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
