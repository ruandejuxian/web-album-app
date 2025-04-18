import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';
import Button from '../ui/Button';
import { FiUpload, FiImage, FiCheck, FiX } from 'react-icons/fi';

interface ResponsiveUploadFormProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

const ResponsiveUploadForm: React.FC<ResponsiveUploadFormProps> = ({
  onUpload,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeInMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { showToast } = useToast();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Generate preview URLs for selected files
  useEffect(() => {
    const urls: string[] = [];
    selectedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });
    
    setPreviewUrls(urls);
    
    // Clean up URLs when component unmounts
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        showToast(`File "${file.name}" không phải là định dạng ảnh được hỗ trợ.`, 'error');
        continue;
      }
      
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        showToast(`File "${file.name}" vượt quá kích thước tối đa ${maxSizeInMB}MB.`, 'error');
        continue;
      }
      
      validFiles.push(file);
    }
    
    return validFiles;
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };
  
  const handleFiles = (files: File[]) => {
    const validFiles = validateFiles(files);
    
    if (validFiles.length === 0) {
      return;
    }
    
    // Check if adding these files would exceed the max files limit
    if (selectedFiles.length + validFiles.length > maxFiles) {
      showToast(`Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh.`, 'warning');
      const remainingSlots = maxFiles - selectedFiles.length;
      
      if (remainingSlots > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles.slice(0, remainingSlots)]);
      }
      
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    showToast(`Đã chọn ${validFiles.length} ảnh thành công.`, 'success');
  };
  
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      showToast('Vui lòng chọn ít nhất một ảnh để tải lên.', 'warning');
      return;
    }
    
    onUpload(selectedFiles);
    showToast(`Đã tải lên ${selectedFiles.length} ảnh thành công.`, 'success');
    setSelectedFiles([]);
    setPreviewUrls([]);
  };
  
  return (
    <AnimatedContainer className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tải ảnh lên</h2>
        <p className="text-gray-600">Chọn hoặc kéo thả ảnh để tải lên album của bạn</p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 md:p-6 transition-colors ${
          isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <FiUpload className="text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4" />
          <p className="text-gray-600 mb-2 text-center text-sm md:text-base">
            {isMobile ? 'Chọn ảnh từ thiết bị của bạn' : 'Kéo thả ảnh vào đây hoặc'}
          </p>
          <label className="cursor-pointer">
            <span className="bg-purple-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base">
              Chọn ảnh từ máy tính
            </span>
            <input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
          <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4 text-center px-2 md:px-0">
            Hỗ trợ định dạng: JPG, PNG, WebP, GIF. Tối đa {maxSizeInMB}MB mỗi ảnh.
          </p>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <AnimatedContainer className="mt-4 md:mt-6" delay={0.2}>
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2 md:mb-3">
            Ảnh đã chọn ({selectedFiles.length}/{maxFiles})
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            <AnimatePresence>
              {previewUrls.map((url, index) => (
                <AnimatedContainer
                  key={url}
                  className="relative rounded-lg overflow-hidden group"
                  delay={index * 0.05}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 md:h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 bg-red-500 text-white rounded-full"
                      aria-label="Remove file"
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {selectedFiles[index].name}
                  </div>
                  {/* Touch-friendly remove button for mobile */}
                  {isMobile && (
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      aria-label="Remove file"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </AnimatedContainer>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFiles([]);
                setPreviewUrls([]);
              }}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              icon={<FiCheck />}
              className="w-full sm:w-auto"
            >
              Tải lên
            </Button>
          </div>
        </AnimatedContainer>
      )}
    </AnimatedContainer>
  );
};

export default ResponsiveUploadForm;
