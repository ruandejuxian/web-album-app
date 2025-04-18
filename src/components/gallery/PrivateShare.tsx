import React, { useState, useEffect } from 'react';
import { FiLink, FiCopy, FiClock, FiShare2, FiLock } from 'react-icons/fi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { v4 as uuidv4 } from 'uuid';
import AnimatedContainer from '../ui/AnimatedContainer';

interface PrivateShareProps {
  imageId: string;
  imageUrl: string;
  imageTitle: string;
}

interface ShareLink {
  id: string;
  url: string;
  expiresAt: Date;
  isExpired: boolean;
}

const PrivateShare: React.FC<PrivateShareProps> = ({
  imageId,
  imageUrl,
  imageTitle
}) => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();
  
  // Load existing share links from localStorage
  useEffect(() => {
    const storedLinks = localStorage.getItem(`shareLinks_${imageId}`);
    if (storedLinks) {
      try {
        const parsedLinks = JSON.parse(storedLinks);
        // Filter out expired links and update isExpired status
        const now = new Date();
        const updatedLinks = parsedLinks.map((link: any) => ({
          ...link,
          expiresAt: new Date(link.expiresAt),
          isExpired: new Date(link.expiresAt) < now
        }));
        
        setShareLinks(updatedLinks);
      } catch (error) {
        console.error('Error parsing stored share links:', error);
      }
    }
  }, [imageId]);
  
  // Save share links to localStorage
  useEffect(() => {
    if (shareLinks.length > 0) {
      localStorage.setItem(`shareLinks_${imageId}`, JSON.stringify(shareLinks));
    }
  }, [shareLinks, imageId]);
  
  // Create a new share link that expires in 24 hours
  const createShareLink = () => {
    setIsCreating(true);
    
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      // Generate a unique token using UUID
      const token = uuidv4();
      
      // Create the share URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared/${token}`;
      
      // Store the shared image data in localStorage
      const sharedImagesData = localStorage.getItem('sharedImages') || '{}';
      const sharedImages = JSON.parse(sharedImagesData);
      
      sharedImages[token] = {
        id: imageId,
        url: imageUrl,
        title: imageTitle,
        expiresAt: expiresAt.toISOString()
      };
      
      localStorage.setItem('sharedImages', JSON.stringify(sharedImages));
      
      const newLink: ShareLink = {
        id: token,
        url: shareUrl,
        expiresAt,
        isExpired: false
      };
      
      setShareLinks([newLink, ...shareLinks]);
      showToast('Đã tạo link chia sẻ thành công!', 'success');
    } catch (error) {
      console.error('Error creating share link:', error);
      showToast('Không thể tạo link chia sẻ', 'error');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Copy share link to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        showToast('Đã sao chép link vào clipboard!', 'success');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        showToast('Không thể sao chép link', 'error');
      });
  };
  
  // Delete a share link
  const deleteShareLink = (id: string) => {
    // Remove from localStorage shared images
    try {
      const sharedImagesData = localStorage.getItem('sharedImages') || '{}';
      const sharedImages = JSON.parse(sharedImagesData);
      
      if (sharedImages[id]) {
        delete sharedImages[id];
        localStorage.setItem('sharedImages', JSON.stringify(sharedImages));
      }
    } catch (error) {
      console.error('Error removing shared image data:', error);
    }
    
    // Remove from share links
    setShareLinks(shareLinks.filter(link => link.id !== id));
    showToast('Đã xóa link chia sẻ', 'success');
  };
  
  // Format expiration time
  const formatExpirationTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Đã hết hạn';
    }
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `Còn ${diffHrs} giờ ${diffMins} phút`;
    } else {
      return `Còn ${diffMins} phút`;
    }
  };
  
  // Clean up expired links
  useEffect(() => {
    const cleanupExpiredLinks = () => {
      const now = new Date();
      const updatedLinks = shareLinks.map(link => ({
        ...link,
        isExpired: link.expiresAt < now
      }));
      
      // Update expired status
      setShareLinks(updatedLinks);
      
      // Clean up shared images data
      try {
        const sharedImagesData = localStorage.getItem('sharedImages') || '{}';
        const sharedImages = JSON.parse(sharedImagesData);
        let hasChanges = false;
        
        Object.keys(sharedImages).forEach(key => {
          const expiresAt = new Date(sharedImages[key].expiresAt);
          if (expiresAt < now) {
            delete sharedImages[key];
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          localStorage.setItem('sharedImages', JSON.stringify(sharedImages));
        }
      } catch (error) {
        console.error('Error cleaning up expired shared images:', error);
      }
    };
    
    // Run cleanup on mount
    cleanupExpiredLinks();
    
    // Set interval to check for expired links every minute
    const interval = setInterval(cleanupExpiredLinks, 60000);
    
    return () => clearInterval(interval);
  }, [shareLinks]);
  
  return (
    <AnimatedContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiLock className="text-purple-600 mr-2" />
          <h3 className="font-medium text-gray-800">Chia sẻ riêng tư</h3>
        </div>
        
        <Button 
          onClick={createShareLink} 
          disabled={isCreating}
          variant="outline" 
          size="sm"
          icon={<FiShare2 />}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo link mới'}
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Tạo link chia sẻ riêng tư có thời hạn 24 giờ. Người nhận link có thể xem ảnh mà không cần đăng nhập.
      </p>
      
      {shareLinks.length > 0 ? (
        <div className="space-y-3 mt-3">
          {shareLinks.map((link) => (
            <div 
              key={link.id}
              className={`p-3 rounded-lg border ${
                link.isExpired 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiLink className={link.isExpired ? 'text-red-500' : 'text-green-500'} />
                  <span className={`ml-2 text-sm font-medium ${
                    link.isExpired ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {link.isExpired ? 'Link đã hết hạn' : 'Link đang hoạt động'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FiClock className="text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">
                    {formatExpirationTime(link.expiresAt)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={link.url}
                  readOnly
                  className="flex-grow text-sm bg-white border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(link.url)}
                  className="bg-purple-600 text-white px-3 py-2 rounded-r-lg hover:bg-purple-700"
                  disabled={link.isExpired}
                >
                  <FiCopy />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Hết hạn: {link.expiresAt.toLocaleString('vi-VN')}
                </span>
                
                <button
                  onClick={() => deleteShareLink(link.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Xóa link
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Chưa có link chia sẻ nào được tạo
        </div>
      )}
    </AnimatedContainer>
  );
};

export default PrivateShare;
