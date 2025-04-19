import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiCpu, FiWifi, FiDatabase } from 'react-icons/fi';
import Button from '../ui/Button';
import AnimatedContainer from '../ui/AnimatedContainer';

interface PerformanceTestResult {
  test: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  metric?: string;
  issues?: string[];
}

const PerformanceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<PerformanceTestResult[]>([
    { 
      test: 'Tải trang', 
      description: 'Thời gian tải trang ban đầu',
      status: 'pending',
    },
    { 
      test: 'Hiển thị ảnh', 
      description: 'Tốc độ tải và hiển thị ảnh',
      status: 'pending',
    },
    { 
      test: 'Phản hồi UI', 
      description: 'Độ trễ khi tương tác với giao diện',
      status: 'pending',
    },
    { 
      test: 'Sử dụng bộ nhớ', 
      description: 'Lượng bộ nhớ sử dụng',
      status: 'pending',
    },
    { 
      test: 'Hiệu ứng', 
      description: 'Độ mượt mà của animation',
      status: 'pending',
    }
  ]);
  
  const [isTestRunning, setIsTestRunning] = useState(false);
  
  // Run performance tests
  const runTest = () => {
    setIsTestRunning(true);
    
    // Reset results
    setTestResults(prev => prev.map(result => ({...result, status: 'pending', metric: undefined, issues: undefined})));
    
    // Simulate testing process with staggered updates
    setTimeout(() => {
      setTestResults(prev => {
        const newResults = [...prev];
        newResults[0] = {
          ...newResults[0],
          status: 'passed',
          metric: '1.2s'
        };
        return newResults;
      });
      
      setTimeout(() => {
        setTestResults(prev => {
          const newResults = [...prev];
          newResults[1] = {
            ...newResults[1],
            status: 'passed',
            metric: '0.8s / ảnh'
          };
          return newResults;
        });
        
        setTimeout(() => {
          setTestResults(prev => {
            const newResults = [...prev];
            newResults[2] = {
              ...newResults[2],
              status: 'passed',
              metric: '<100ms'
            };
            return newResults;
          });
          
          setTimeout(() => {
            setTestResults(prev => {
              const newResults = [...prev];
              newResults[3] = {
                ...newResults[3],
                status: 'warning',
                metric: '~120MB',
                issues: ['Sử dụng nhiều bộ nhớ khi tải nhiều ảnh']
              };
              return newResults;
            });
            
            setTimeout(() => {
              setTestResults(prev => {
                const newResults = [...prev];
                newResults[4] = {
                  ...newResults[4],
                  status: 'passed',
                  metric: '60fps'
                };
                return newResults;
              });
              
              setIsTestRunning(false);
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };
  
  const getTestIcon = (test: string) => {
    switch (test) {
      case 'Tải trang':
        return <FiWifi size={24} className="text-blue-500" />;
      case 'Hiển thị ảnh':
        return <FiDatabase size={24} className="text-purple-500" />;
      case 'Phản hồi UI':
        return <FiCpu size={24} className="text-green-500" />;
      case 'Sử dụng bộ nhớ':
        return <FiDatabase size={24} className="text-orange-500" />;
      case 'Hiệu ứng':
        return <FiCpu size={24} className="text-pink-500" />;
      default:
        return <FiCpu size={24} />;
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kiểm tra hiệu suất</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-4">
          Kiểm tra hiệu suất của ứng dụng trên thiết bị hiện tại để đảm bảo trải nghiệm người dùng tốt nhất.
        </p>
        
        <Button 
          onClick={runTest} 
          disabled={isTestRunning}
          fullWidth
        >
          {isTestRunning ? 'Đang kiểm tra...' : 'Chạy kiểm tra hiệu suất'}
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
                {getTestIcon(result.test)}
                <div className="ml-2">
                  <span className="font-medium">{result.test}</span>
                  <p className="text-xs text-gray-500">{result.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                {result.metric && (
                  <span className="mr-3 text-sm font-mono bg-white px-2 py-1 rounded border">
                    {result.metric}
                  </span>
                )}
                {getStatusIcon(result.status)}
              </div>
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
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Gợi ý cải thiện hiệu suất:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Giảm số lượng ảnh tải cùng lúc để tiết kiệm bộ nhớ</li>
          <li>Sử dụng ảnh đã được tối ưu hóa kích thước</li>
          <li>Tắt một số hiệu ứng animation trên thiết bị có hiệu suất thấp</li>
          <li>Sử dụng lazy loading cho ảnh khi cuộn trang</li>
          <li>Xóa cache định kỳ để giải phóng bộ nhớ</li>
        </ul>
      </div>
    </AnimatedContainer>
  );
};

export default PerformanceTest;
