import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';
import { StoredImage } from '../../hooks/useStorage/useLocalStorage';
import { downloadImageWithQuality } from '../../lib/api/googleDrive';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: StoredImage | null;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, image }) => {
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'original'>('medium');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!image) return;
    
    try {
      setIsDownloading(true);
      setError(null);
      await downloadImageWithQuality(image, selectedQuality);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại sau.');
    } finally {
      setIsDownloading(false);
    }
  };

  const qualityOptions = [
    { value: 'low', label: 'Thấp (~100KB)', description: 'Phù hợp cho chia sẻ nhanh qua tin nhắn' },
    { value: 'medium', label: 'Trung bình (~500KB)', description: 'Cân bằng giữa chất lượng và dung lượng' },
    { value: 'original', label: 'Nguyên bản (1-5MB)', description: 'Chất lượng cao nhất có thể' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Tải ảnh về</h3>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    
                    {image && (
                      <div className="mb-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-48 object-contain"
                          />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">{image.title}</h4>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn chất lượng ảnh
                      </label>
                      <div className="space-y-2">
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
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleDownload}
                  disabled={isDownloading || !image}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" /> Tải xuống
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;
