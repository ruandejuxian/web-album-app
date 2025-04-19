import React, { useState, useEffect } from 'react';
import { FiSmartphone, FiTablet, FiMonitor, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import AnimatedContainer from '../ui/AnimatedContainer';

interface DeviceTestResult {
  device: string;
  viewport: string;
  status: 'passed' | 'failed' | 'pending';
  issues?: string[];
}

const ResponsiveTest: React.FC = () => {
  const [testResults, setTestResults] = useState<DeviceTestResult[]>([
    { 
      device: 'Mobile', 
      viewport: '320px - 480px', 
      status: 'pending',
    },
    { 
      device: 'Tablet', 
      viewport: '768px - 1024px', 
      status: 'pending',
    },
    { 
      device: 'Desktop', 
      viewport: '1280px - 1920px', 
      status: 'pending',
    }
  ]);
  
  const [currentViewport, setCurrentViewport] = useState<string>('');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  // Detect current viewport
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setViewportHeight(window.innerHeight);
      
      if (width < 480) {
        setCurrentViewport('Mobile');
      } else if (width < 1024) {
        setCurrentViewport('Tablet');
      } else {
        setCurrentViewport('Desktop');
      }
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);
  
  // Run tests for current viewport
  const runTest = () => {
    setIsTestRunning(true);
    
    // Simulate testing process
    setTimeout(() => {
      setTestResults(prev => 
        prev.map(result => {
          if (result.device === currentViewport) {
            // Perform actual tests based on current viewport
            const issues = [];
            
            // Check for common responsive issues
            if (currentViewport === 'Mobile') {
              if (viewportWidth < 360) {
                issues.push('Một số phần tử có thể bị cắt trên màn hình rất nhỏ');
              }
              
              // Check if touch targets are large enough
              if (document.querySelectorAll('button, a, input, select, textarea').length > 0) {
                const smallElements = Array.from(document.querySelectorAll('button, a, input, select, textarea'))
                  .filter((el: Element) => {
                    const rect = el.getBoundingClientRect();
                    return (rect.width < 44 || rect.height < 44);
                  });
                
                if (smallElements.length > 0) {
                  issues.push(`${smallElements.length} phần tử tương tác có kích thước quá nhỏ cho thiết bị cảm ứng`);
                }
              }
            }
            
            // Check for horizontal overflow
            const bodyWidth = document.body.scrollWidth;
            if (bodyWidth > viewportWidth) {
              issues.push(`Phát hiện cuộn ngang (${bodyWidth}px > ${viewportWidth}px)`);
            }
            
            // Check font sizes for readability
            if (currentViewport === 'Mobile') {
              const smallTexts = Array.from(document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6'))
                .filter((el: Element) => {
                  const style = window.getComputedStyle(el);
                  const fontSize = parseFloat(style.fontSize);
                  return fontSize < 12 && el.textContent && el.textContent.trim().length > 0;
                });
              
              if (smallTexts.length > 0) {
                issues.push(`${smallTexts.length} phần tử văn bản có font size quá nhỏ (< 12px)`);
              }
            }
            
            return {
              ...result,
              status: issues.length > 0 ? 'failed' : 'passed',
              issues: issues
            };
          }
          return result;
        })
      );
      
      setIsTestRunning(false);
    }, 2000);
  };
  
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <FiSmartphone size={24} />;
      case 'Tablet':
        return <FiTablet size={24} />;
      case 'Desktop':
        return <FiMonitor size={24} />;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <FiXCircle className="text-red-500" size={20} />;
      case 'pending':
        return <div className="w-5 h-5 rounded-full bg-gray-200"></div>;
      default:
        return null;
    }
  };
  
  return (
    <AnimatedContainer className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kiểm tra tương thích thiết bị</h2>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <p className="text-gray-600 mb-2 sm:mb-0">Thiết bị hiện tại:</p>
          <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {getDeviceIcon(currentViewport)}
            <span className="ml-2">{currentViewport}</span>
            <span className="ml-2 text-xs">({viewportWidth}x{viewportHeight}px)</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Thay đổi kích thước cửa sổ trình duyệt hoặc sử dụng các thiết bị khác nhau để kiểm tra tính responsive.
        </p>
        
        <Button 
          onClick={runTest} 
          disabled={isTestRunning}
          fullWidth
        >
          {isTestRunning ? 'Đang kiểm tra...' : 'Kiểm tra thiết bị hiện tại'}
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
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getDeviceIcon(result.device)}
                <span className="ml-2 font-medium">{result.device}</span>
                <span className="ml-2 text-sm text-gray-500 hidden sm:inline">({result.viewport})</span>
              </div>
              {getStatusIcon(result.status)}
            </div>
            
            <div className="sm:hidden mt-1 mb-2">
              <span className="text-xs text-gray-500">({result.viewport})</span>
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
            
            {result.status === 'passed' && (
              <p className="text-sm text-green-600 mt-1">
                Tất cả các tính năng hoạt động tốt trên thiết bị này.
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn kiểm tra:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Mở ứng dụng trên các thiết bị khác nhau (điện thoại, máy tính bảng, máy tính)</li>
          <li>Kiểm tra xem tất cả các tính năng có hoạt động đúng không</li>
          <li>Kiểm tra giao diện có hiển thị đúng và đẹp trên mọi kích thước màn hình</li>
          <li>Kiểm tra các hiệu ứng và animation có mượt mà không</li>
          <li>Kiểm tra tốc độ tải trang và hiệu suất</li>
        </ol>
      </div>
    </AnimatedContainer>
  );
};

export default ResponsiveTest;
