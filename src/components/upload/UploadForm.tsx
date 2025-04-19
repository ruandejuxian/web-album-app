import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiCheck, FiLink } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';

interface UploadFormProps {
  onUploadSuccess?: (fileUrls: string[]) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [driveLink, setDriveLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  // Trigger file input click
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (files.length === 0) {
      showToast('Vui lòng chọn ít nhất một file để tải lên', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
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
      const mockUrls = files.map((file, index) => 
        `https://example.com/uploads/${Date.now()}_${index}_${file.name}`
      );
      
      if (onUploadSuccess) {
        onUploadSuccess(mockUrls);
      }
      
      showToast('Tải lên thành công!', 'success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFiles([]);
        setIsUploading(false);
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Có lỗi xảy ra khi tải lên', 'error');
      setIsUploading(false);
    }
  };

  // Handle Drive link submission
  const handleDriveLinkSubmit = async () => {
    if (!driveLink.trim()) {
      showToast('Vui lòng nhập link Google Drive', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
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
      
      // Generate mock URL for uploaded file
      const mockUrl = `https://example.com/uploads/drive_${Date.now()}.jpg`;
      
      if (onUploadSuccess) {
        onUploadSuccess([mockUrl]);
      }
      
      showToast('Xử lý link thành công!', 'success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setDriveLink('');
        setIsUploading(false);
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Drive link processing error:', error);
      showToast('Có lỗi xảy ra khi xử lý link', 'error');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tải ảnh lên</h2>
      
      {/* Upload method selection */}
      <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-6">
        <button
          className={`flex-1 py-3 font-medium transition-colors ${
            uploadMethod === 'file'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setUploadMethod('file')}
          disabled={isUploading}
        >
          Tải từ máy tính
        </button>
        <button
          className={`flex-1 py-3 font-medium transition-colors ${
            uploadMethod === 'link'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setUploadMethod('link')}
          disabled={isUploading}
        >
          Từ Google Drive
        </button>
      </div>
      
      {/* Upload form content */}
      <div>
        <AnimatePresence mode="wait">
          {uploadMethod === 'file' ? (
            <motion.div
              key="file-upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {/* File input (hidden) */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                {/* File drop area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={handleSelectFiles}
                >
                  <div className="flex flex-col items-center">
                    <FiUpload className="text-purple-600 text-3xl mb-2" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                      Kéo thả ảnh vào đây
                    </h3>
                    <p className="text-gray-500 mb-4">
                      hoặc nhấn để chọn ảnh từ máy tính
                    </p>
                    <Button variant="outline" size="sm" disabled={isUploading}>
                      Chọn ảnh
                    </Button>
                  </div>
                </div>
                
                {/* Selected files */}
                {files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Đã chọn {files.length} ảnh
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden mr-3">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200"
                            onClick={() => removeFile(index)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      className="mt-4 w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={handleFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <span className="mr-2">Đang tải lên... {uploadProgress.toFixed(0)}%</span>
                          <div className="w-24 h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <FiCheck className="mr-2" />
                          Tải lên thành công!
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" />
                          Tải lên
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="link-upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="drive-link"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Link Google Drive
                  </label>
                  <input
                    type="text"
                    id="drive-link"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    disabled={isUploading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Nhập link chia sẻ từ Google Drive (đảm bảo link đã được chia sẻ công khai)
                  </p>
                </div>
                
                <button
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleDriveLinkSubmit}
                  disabled={!driveLink.trim() || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="mr-2">Đang xử lý... {uploadProgress.toFixed(0)}%</span>
                      <div className="w-24 h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <FiCheck className="mr-2" />
                      Xử lý thành công!
                    </>
                  ) : (
                    <>
                      <FiLink className="mr-2" />
                      Xử lý link
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Upload guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Lưu ý khi tải ảnh lên</h3>
        <ul className="text-blue-700 space-y-1 list-disc pl-5">
          <li>Định dạng hỗ trợ: JPG, PNG, GIF, WebP</li>
          <li>Kích thước tối đa: 10MB mỗi ảnh</li>
          <li>Độ phân giải tối thiểu: 800x600 pixels</li>
          <li>Không tải lên ảnh vi phạm bản quyền hoặc nội dung không phù hợp</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadForm;
