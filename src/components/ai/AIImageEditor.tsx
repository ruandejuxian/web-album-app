import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { FiImage, FiSliders, FiSun, FiDroplet, FiCrop, FiRotateCw } from 'react-icons/fi';

interface AIImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

const AIImageEditor: React.FC<AIImageEditorProps> = ({
  imageUrl,
  onSave,
  onCancel
}) => {
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  // Simulated AI enhancement filters
  const filters = [
    { id: 'original', name: 'Gốc', icon: <FiImage /> },
    { id: 'enhance', name: 'Tăng cường', icon: <FiSliders /> },
    { id: 'vivid', name: 'Sống động', icon: <FiSun /> },
    { id: 'smooth', name: 'Mềm mại', icon: <FiDroplet /> },
    { id: 'portrait', name: 'Chân dung', icon: <FiCrop /> },
    { id: 'vintage', name: 'Cổ điển', icon: <FiRotateCw /> },
  ];
  
  // Apply filter styles based on current settings
  const getFilterStyle = () => {
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    if (blur > 0) {
      filterString += ` blur(${blur}px)`;
    }
    
    // Add predefined filters
    if (currentFilter === 'enhance') {
      filterString += ' contrast(110%) saturate(110%)';
    } else if (currentFilter === 'vivid') {
      filterString += ' contrast(120%) saturate(130%)';
    } else if (currentFilter === 'smooth') {
      filterString += ' brightness(105%) saturate(90%) blur(0.5px)';
    } else if (currentFilter === 'portrait') {
      filterString += ' brightness(105%) contrast(105%) saturate(95%)';
    } else if (currentFilter === 'vintage') {
      filterString += ' brightness(100%) contrast(95%) saturate(85%) sepia(20%)';
    }
    
    return {
      filter: filterString,
      transform: `rotate(${rotation}deg)`
    };
  };
  
  // Simulate AI enhancement (in a real app, this would call an API)
  const applyAIEnhancement = (filterId: string) => {
    setCurrentFilter(filterId);
    
    // Reset sliders when changing filters
    if (filterId === 'original') {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
    } else if (filterId === 'enhance') {
      setBrightness(105);
      setContrast(110);
      setSaturation(110);
      setBlur(0);
    } else if (filterId === 'vivid') {
      setBrightness(105);
      setContrast(120);
      setSaturation(130);
      setBlur(0);
    } else if (filterId === 'smooth') {
      setBrightness(105);
      setContrast(100);
      setSaturation(90);
      setBlur(0.5);
    } else if (filterId === 'portrait') {
      setBrightness(105);
      setContrast(105);
      setSaturation(95);
      setBlur(0);
    } else if (filterId === 'vintage') {
      setBrightness(100);
      setContrast(95);
      setSaturation(85);
      setBlur(0);
    }
  };
  
  // Simulate saving the edited image
  const handleSave = () => {
    // In a real app, this would send the edited image to a server for processing
    // For now, we'll just pass back the original URL
    onSave(imageUrl);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa ảnh với AI</h2>
        <p className="text-gray-600 text-sm">Sử dụng các bộ lọc thông minh để nâng cao chất lượng ảnh</p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Image preview */}
        <div className="md:w-2/3 p-4 bg-gray-50 flex items-center justify-center">
          <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-contain"
              style={getFilterStyle()}
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="md:w-1/3 p-4 border-l">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Bộ lọc AI</h3>
            <div className="grid grid-cols-3 gap-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm ${
                    currentFilter === filter.id 
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-500' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => applyAIEnhancement(filter.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl mb-1">{filter.icon}</span>
                  {filter.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Điều chỉnh thủ công</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Độ sáng</label>
                <span className="text-sm text-gray-600">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Độ tương phản</label>
                <span className="text-sm text-gray-600">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Độ bão hòa</label>
                <span className="text-sm text-gray-600">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Độ mờ</label>
                <span className="text-sm text-gray-600">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={blur}
                onChange={(e) => setBlur(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Xoay</label>
                <span className="text-sm text-gray-600">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} fullWidth>
              Hủy
            </Button>
            <Button onClick={handleSave} fullWidth>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageEditor;
