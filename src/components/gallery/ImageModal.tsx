import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShare2, FiDownload, FiMessageCircle } from 'react-icons/fi';
import DownloadModal from './DownloadModal';
import ShareModal from './ShareModal';
import AIToolsMenu from '../ai/AIToolsMenu';
import { ImageAnalysisResult } from '../ai/AIImageAnalyzer';
import { useToast } from '../context/ToastContext';

interface Image {
  id: string;
  url: string;
  title: string;
  description?: string;
  likes: number;
  date: string;
  tags: string[];
  isPrivate: boolean;
}

interface ImageModalProps {
  image: Image;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (image: Image) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [liked, setLiked] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{text: string, date: Date}[]>([]);
  const { showToast } = useToast();
  
  if (!isOpen) return null;
  
  const handleLike = () => {
    setLiked(!liked);
    if (onUpdate) {
      onUpdate({
        ...image,
        likes: liked ? image.likes - 1 : image.likes + 1
      });
    }
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, {text: comment, date: new Date()}]);
      setComment('');
      showToast('Bình luận đã được thêm', 'success');
    }
  };
  
  const handleAIChanges = (updatedImageUrl: string, analysisData?: ImageAnalysisResult) => {
    if (analysisData) {
      // Update image with AI analysis results
      if (onUpdate) {
        onUpdate({
          ...image,
          tags: [...new Set([...image.tags, ...analysisData.tags])],
          description: analysisData.description || image.description
        });
      }
    }
    
    // In a real app, we would update the image URL with the edited version
    // For now, we'll just show a toast
    showToast('Ảnh đã được cập nhật thành công', 'success');
  };
  
  const formattedDate = new Date(image.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{image.title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-auto flex flex-col md:flex-row">
          {/* Image container */}
          <div className="md:w-2/3 bg-gray-100 flex items-center justify-center p-4">
            <div className="relative max-h-[60vh] overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          </div>
          
          {/* Details container */}
          <div className="md:w-1/3 p-4 flex flex-col h-full overflow-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{formattedDate}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${image.isPrivate ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}`}>
                  {image.isPrivate ? 'Riêng tư' : 'Công khai'}
                </span>
              </div>
              
              {image.description && (
                <p className="text-gray-700 mb-4">{image.description}</p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-4">
                {image.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between mb-6">
              <button
                className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                onClick={handleLike}
              >
                <FiHeart className={liked ? 'fill-current' : ''} size={20} />
                <span className="ml-1">{image.likes + (liked ? 1 : 0)}</span>
              </button>
              
              <button
                className="flex items-center text-gray-500 hover:text-blue-500"
                onClick={() => setShowShareModal(true)}
              >
                <FiShare2 size={20} />
                <span className="ml-1">Chia sẻ</span>
              </button>
              
              <button
                className="flex items-center text-gray-500 hover:text-green-500"
                onClick={() => setShowDownloadModal(true)}
              >
                <FiDownload size={20} />
                <span className="ml-1">Tải xuống</span>
              </button>
              
              <AIToolsMenu 
                imageUrl={image.url}
                onApplyChanges={handleAIChanges}
              />
            </div>
            
            {/* Comments section */}
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Bình luận</h3>
              
              <div className="mb-4 max-h-40 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{comment.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.date.toLocaleString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleAddComment} className="flex">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Thêm bình luận..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 flex items-center"
                  disabled={!comment.trim()}
                >
                  <FiMessageCircle className="mr-1" />
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <DownloadModal
            image={image}
            onClose={() => setShowDownloadModal(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            image={image}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageModal;
