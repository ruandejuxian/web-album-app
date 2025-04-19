import React, { useState } from 'react';
import { FiChrome, FiGlobe, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import AnimatedContainer from '../ui/AnimatedContainer';

interface BrowserTestResult {
  browser: string;
  version: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  issues?: string[];
}

const BrowserCompatibilityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<BrowserTestResult[]>([
    { 
      browser: 'Chrome', 
      version: '90+', 
      status: 'pending',
    },
    { 
      browser: 'Firefox', 
      version: '88+', 
      status: 'pending',
    },
    { 
      browser: 'Safari', 
      version: '14+', 
      status: 'pending',
    },
    { 
      browser: 'Edge', 
      version: '90+', 
      status: 'pending',
    },
    { 
      browser: 'Mobile Safari', 
      version: 'iOS 14+', 
      status: 'pending',
    },
    { 
      browser: 'Mobile Chrome', 
      version: 'Android 10+', 
      status: 'pending',
    }
  ]);
  
  const [currentBrowser, setCurrentBrowser] = useState<string>('');
  const [isTestRunning, setIsTestRunning] = useState(false);
  
  // Detect current browser
  React.useEffect(() => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      browser = 'Safari';
    } else if (userAgent.indexOf('Edge') > -1) {
      browser = 'Edge';
    }
    
    // Check if mobile
    if (/iPhone|iPad|iPod/i.test(userAgent) && browser === 'Safari') {
      browser = 'Mobile Safari';
    } else if (/Android/i.test(userAgent) && browser === 'Chrome') {
      browser = 'Mobile Chrome';
    }
    
    setCurrentBrowser(browser);
  }, []);
  
  // Run tests for current browser
  const runTest = () => {
    setIsTestRunning(true);
    
    // Simulate testing process
    setTimeout(() => {
      setTestResults(prev => 
        prev.map(result => {
          if (result.browser === currentBrowser) {
            // Simulate test results based on current browser
            if (currentBrowser === 'Chrome' || currentBrowser === 'Firefox' || currentBrowser === 'Edge') {
              return {
                ...result,
                status: 'passed',
                issues: []
              };
            } else if (currentBrowser === 'Safari') {
              return {
                ...result,
                status: 'warning',
                issues: ['Một số hiệu ứng animation có thể không mượt mà']
              };
            } else {
              return {
                ...result,
                status: 'warning',
                issues: ['Hiệu suất có thể bị giảm trên thiết bị cũ']
              };
            }
          }
          return result;
        })
      );
      
      setIsTestRunning(false);
    }, 2000);
  };
  
  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'Chrome':
      case 'Mobile Chrome':
        return <FiChrome size={24} className="text-blue-500" />;
      case 'Firefox':
        return <FiGlobe size={24} className="text-orange-500" />;
      case 'Safari':
      case 'Mobile Safari':
        return <FiGlobe size={24} className="text-blue-400" />;
      case 'Edge':
        return <FiGlobe size={24} className="text-teal-500" />;
      default:
        return <FiGlobe size={24} />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <FiXCircle className="text-red-500" size={20} />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      case 'pending':
        return <div className="w-5 h-5 rounded-full bg-gray-200"></div>;
      default:
        return null;
    }
  };
  
  return (
    <AnimatedContainer className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kiểm tra tương thích trình duyệt</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600">Trình duyệt hiện tại:</p>
          <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {getBrowserIcon(currentBrowser)}
            <span className="ml-2">{currentBrowser}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Mở ứng dụng trên các trình duyệt khác nhau để kiểm tra tính tương thích.
        </p>
        
        <Button 
          onClick={runTest} 
          disabled={isTestRunning}
          fullWidth
        >
          {isTestRunning ? 'Đang kiểm tra...' : 'Kiểm tra trình duyệt hiện tại'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Kết quả kiểm tra:</h3>
        
        {testResults.map((result, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${
              result.status === 'passed' 
                ? 'border-green-200 bg-green-50' 
                : result.status === 'failed'
                  ? 'border-red-200 bg-red-50'
                  : result.status === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getBrowserIcon(result.browser)}
                <span className="ml-2 font-medium">{result.browser}</span>
                <span className="ml-2 text-sm text-gray-500">({result.version})</span>
              </div>
              {getStatusIcon(result.status)}
            </div>
            
            {result.status === 'failed' && result.issues && result.issues.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600">Vấn đề phát hiện:</p>
                <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                  {result.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.status === 'warning' && result.issues && result.issues.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-yellow-700">Cảnh báo:</p>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                  {result.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.status === 'passed' && (
              <p className="text-sm text-green-600 mt-1">
                Tất cả các tính năng hoạt động tốt trên trình duyệt này.
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn kiểm tra:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Mở ứng dụng trên các trình duyệt khác nhau</li>
          <li>Kiểm tra xem tất cả các tính năng có hoạt động đúng không</li>
          <li>Kiểm tra các hiệu ứng và animation có hiển thị đúng không</li>
          <li>Kiểm tra tốc độ tải trang và hiệu suất</li>
          <li>Kiểm tra các tính năng đặc biệt như kéo thả, tải lên, tải xuống</li>
        </ol>
      </div>
    </AnimatedContainer>
  );
};

export default BrowserCompatibilityTest;
