import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import AnimatedContainer from '../ui/AnimatedContainer';

interface ResponsiveUploadFormProps {
  onUploadSuccess?: (fileUrls: string[]) => void;
}

const ResponsiveUploadForm: React.FC<ResponsiveUploadFormProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Simulate upload process
  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setUploadProgress(100);
    setUploadSuccess(true);
    
    // Generate mock URLs for uploaded files
    const mockUrls = [
      `https://example.com/uploads/${Date.now()}_1.jpg`,
      `https://example.com/uploads/${Date.now()}_2.jpg`
    ];
    
    if (onUploadSuccess) {
      onUploadSuccess(mockUrls);
    }
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(false);
    }, 2000);
  };
  
  return (
    <AnimatedContainer>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tải ảnh lên</h2>
        
        {/* Responsive file upload area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => !isUploading && !uploadSuccess && simulateUpload()}>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
              {uploadSuccess ? 'Tải lên thành công!' : 'Kéo thả ảnh vào đây'}
            </h3>
            
            {!uploadSuccess && (
              <p className="text-sm text-gray-500 mb-4 hidden sm:block">
                hoặc nhấn để chọn ảnh từ thiết bị của bạn
              </p>
            )}
            
            {isUploading && (
              <div className="w-full max-w-xs mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-700">
                    Đang tải lên...
                  </span>
                  <span className="text-sm font-medium text-purple-700">
                    {uploadProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="flex items-center text-green-600 mt-2">
                <FiCheck className="mr-1" />
                <span>Tải lên thành công!</span>
              </div>
            )}
            
            {!isUploading && !uploadSuccess && (
              <button className="mt-2 sm:mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Chọn ảnh
              </button>
            )}
          </div>
        </div>
        
        {/* Responsive guidelines */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-1 sm:mb-2">Lưu ý khi tải ảnh lên</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 list-disc pl-4 sm:pl-5">
            <li>Định dạng hỗ trợ: JPG, PNG, GIF, WebP</li>
            <li>Kích thước tối đa: 10MB mỗi ảnh</li>
            <li className="hidden sm:list-item">Độ phân giải tối thiểu: 800x600 pixels</li>
            <li className="hidden sm:list-item">Không tải lên ảnh vi phạm bản quyền</li>
          </ul>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default ResponsiveUploadForm;
