import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiLayers } from 'react-icons/fi';
import Button from '../ui/Button';
import AnimatedContainer from '../ui/AnimatedContainer';
import ResponsiveTest from './ResponsiveTest';
import BrowserCompatibilityTest from './BrowserCompatibilityTest';
import PerformanceTest from './PerformanceTest';

type TestType = 'responsive' | 'browser' | 'performance';

const TestDashboard: React.FC = () => {
  const [activeTest, setActiveTest] = useState<TestType>('responsive');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedContainer>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kiểm tra tương thích và hiệu suất</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setActiveTest('responsive')}
              variant={activeTest === 'responsive' ? 'primary' : 'outline'}
              icon={<FiLayers />}
            >
              Kiểm tra thiết bị
            </Button>
            <Button 
              onClick={() => setActiveTest('browser')}
              variant={activeTest === 'browser' ? 'primary' : 'outline'}
              icon={<FiLayers />}
            >
              Kiểm tra trình duyệt
            </Button>
            <Button 
              onClick={() => setActiveTest('performance')}
              variant={activeTest === 'performance' ? 'primary' : 'outline'}
              icon={<FiLayers />}
            >
              Kiểm tra hiệu suất
            </Button>
          </div>
        </div>
        
        {activeTest === 'responsive' && <ResponsiveTest />}
        {activeTest === 'browser' && <BrowserCompatibilityTest />}
        {activeTest === 'performance' && <PerformanceTest />}
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng quan kiểm tra</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiCheckCircle className="text-green-500 mr-2" size={20} />
                <h3 className="font-medium text-green-800">Đã kiểm tra</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Giao diện responsive</li>
                <li>✓ Tương thích trình duyệt</li>
                <li>✓ Hiệu suất tải trang</li>
                <li>✓ Hiệu ứng và animation</li>
              </ul>
            </div>
            
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiAlertCircle className="text-yellow-500 mr-2" size={20} />
                <h3 className="font-medium text-yellow-800">Cảnh báo</h3>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>⚠️ Sử dụng nhiều bộ nhớ khi tải nhiều ảnh</li>
                <li>⚠️ Một số hiệu ứng có thể chậm trên thiết bị cũ</li>
                <li>⚠️ Safari có thể hiển thị animation không mượt</li>
              </ul>
            </div>
            
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FiLayers className="text-blue-500 mr-2" size={20} />
                <h3 className="font-medium text-blue-800">Khuyến nghị</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Kiểm tra trên nhiều thiết bị thực tế</li>
                <li>• Tối ưu hóa kích thước ảnh trước khi tải lên</li>
                <li>• Sử dụng lazy loading cho gallery lớn</li>
                <li>• Cân nhắc giảm hiệu ứng trên thiết bị di động</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default TestDashboard;
