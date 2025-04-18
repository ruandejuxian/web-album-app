import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { FiImage, FiZap, FiSun, FiMoon, FiDroplet, FiCamera } from 'react-icons/fi';

interface AIImageEnhancerProps {
  imageUrl: string;
  onSave: (enhancedImageUrl: string) => void;
  onCancel: () => void;
}

const AIImageEnhancer: React.FC<AIImageEnhancerProps> = ({
  imageUrl,
  onSave,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null);
  
  // Enhancement options
  const enhancementOptions = [
    { id: 'hdr', name: 'HDR', icon: <FiSun />, description: 'Tăng cường độ tương phản và chi tiết' },
    { id: 'denoise', name: 'Giảm nhiễu', icon: <FiDroplet />, description: 'Loại bỏ nhiễu và làm mịn ảnh' },
    { id: 'lowlight', name: 'Ánh sáng yếu', icon: <FiMoon />, description: 'Cải thiện ảnh chụp trong điều kiện thiếu sáng' },
    { id: 'sharpen', name: 'Làm sắc nét', icon: <FiZap />, description: 'Tăng độ sắc nét và chi tiết' },
    { id: 'portrait', name: 'Chân dung', icon: <FiCamera />, description: 'Tối ưu hóa ảnh chân dung' },
  ];
  
  // Simulate AI enhancement (in a real app, this would call an API)
  const enhanceImage = (enhancementType: string) => {
    setIsProcessing(true);
    setSelectedEnhancement(enhancementType);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would return a new URL to the enhanced image
      // For now, we'll just use the original image
      setEnhancedImageUrl(imageUrl);
      setIsProcessing(false);
    }, 2000);
  };
  
  const handleSave = () => {
    if (enhancedImageUrl) {
      onSave(enhancedImageUrl);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Nâng cao chất lượng ảnh với AI</h2>
        <p className="text-gray-600 text-sm">Sử dụng AI để tự động cải thiện chất lượng ảnh</p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Image preview */}
        <div className="md:w-2/3 p-4 bg-gray-50 flex items-center justify-center">
          <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
                  <p className="text-white">Đang xử lý...</p>
                </div>
              </div>
            ) : null}
            
            <div className="flex h-full">
              {enhancedImageUrl ? (
                <div className="flex-1 relative">
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Sau
                  </div>
                  <img 
                    src={enhancedImageUrl} 
                    alt="Enhanced" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
              
              <div className={`${enhancedImageUrl ? 'flex-1 border-l border-white' : 'w-full'} relative`}>
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Trước
                </div>
                <img 
                  src={imageUrl} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhancement options */}
        <div className="md:w-1/3 p-4 border-l">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Chọn kiểu nâng cao</h3>
          
          <div className="space-y-3 mb-6">
            {enhancementOptions.map((option) => (
              <motion.button
                key={option.id}
                className={`w-full p-3 rounded-lg flex items-center text-left ${
                  selectedEnhancement === option.id 
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-500' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => enhanceImage(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
              >
                <span className="text-xl p-2 bg-white rounded-full mr-3 shadow-sm">
                  {option.icon}
                </span>
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-auto flex space-x-2">
            <Button variant="outline" onClick={onCancel} fullWidth disabled={isProcessing}>
              Hủy
            </Button>
            <Button 
              onClick={handleSave} 
              fullWidth 
              disabled={!enhancedImageUrl || isProcessing}
            >
              Lưu ảnh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageEnhancer;
