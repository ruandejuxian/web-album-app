import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCopy, FiX, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';
import { StoredImage } from '../../hooks/useStorage/useLocalStorage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: StoredImage | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, image }) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  // Generate a temporary share link (in a real app, this would create a unique link)
  React.useEffect(() => {
    if (image && isOpen) {
      // For demonstration, we're just creating a fake share link
      // In a real app, this would generate a unique link or use the actual image URL
      const baseUrl = window.location.origin;
      const tempLink = `${baseUrl}/shared/${image.id}?expires=${Date.now() + 86400000}`; // 24 hours expiry
      setShareLink(tempLink);
    }
  }, [image, isOpen]);

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareSocial = (platform: string) => {
    if (!image) return;
    
    let shareUrl = '';
    const text = encodeURIComponent(`Xem ảnh "${image.title}" của tôi`);
    const url = encodeURIComponent(shareLink);
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

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
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Chia sẻ ảnh</h3>
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
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link chia sẻ (hết hạn sau 24 giờ)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                          {copied ? 'Đã sao chép!' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chia sẻ qua mạng xã hội
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleShareSocial('facebook')}
                          className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          <FiFacebook className="mr-2" /> Facebook
                        </button>
                        <button
                          onClick={() => handleShareSocial('twitter')}
                          className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none"
                        >
                          <FiTwitter className="mr-2" /> Twitter
                        </button>
                        <button
                          onClick={() => handleShareSocial('email')}
                          className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
                        >
                          <FiMail className="mr-2" /> Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
