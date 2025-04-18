import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCheck, FiX } from 'react-icons/fi';
import { StoredImage } from '../../hooks/useStorage/useLocalStorage';
import { downloadImageWithQuality } from '../../lib/api/googleDrive';

interface MultiDownloadProps {
  selectedImages: StoredImage[];
  onClose: () => void;
  onClearSelection: () => void;
}

const MultiDownloadPanel: React.FC<MultiDownloadProps> = ({ 
  selectedImages, 
  onClose,
  onClearSelection
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'original'>('medium');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (selectedImages.length === 0) return;
    
    try {
      setIsDownloading(true);
      setError(null);
      
      // Process each image
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const progress = Math.floor(((i + 1) / selectedImages.length) * 100);
        setDownloadProgress(progress);
        
        // Download the image with selected quality
        await downloadImageWithQuality(image, selectedQuality);
        
        // Add a small delay to prevent browser from blocking multiple downloads
        if (i < selectedImages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Reset after successful download
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        onClearSelection();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error downloading images:', err);
      setError('Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại sau.');
      setIsDownloading(false);
    }
  };

  const qualityOptions = [
    { value: 'low', label: 'Thấp (~100KB)', description: 'Phù hợp cho chia sẻ nhanh qua tin nhắn' },
    { value: 'medium', label: 'Trung bình (~500KB)', description: 'Cân bằng giữa chất lượng và dung lượng' },
    { value: 'original', label: 'Nguyên bản (1-5MB)', description: 'Chất lượng cao nhất có thể' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg p-4 z-30"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Tải xuống {selectedImages.length} ảnh đã chọn
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn chất lượng ảnh
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {qualityOptions.map((option) => (
              <div
                key={option.value}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedQuality === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedQuality(option.value as any)}
              >
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      checked={selectedQuality === option.value}
                      onChange={() => setSelectedQuality(option.value as any)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{option.label}</label>
                    <p className="text-gray-500">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClearSelection}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            disabled={isDownloading}
          >
            Bỏ chọn tất cả
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isDownloading || selectedImages.length === 0}
          >
            {isDownloading ? (
              <>
                <span className="mr-2">Đang tải... {downloadProgress}%</span>
                <div className="w-20 h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <>
                <FiDownload className="mr-2" /> Tải xuống
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MultiDownloadPanel;
