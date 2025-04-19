import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiDownload, FiTrash2, FiEdit } from 'react-icons/fi';

// Temporary type for images until we implement the actual data fetching
interface Image {
  id: string;
  url: string;
  title: string;
  likes: number;
  date: string;
  tags: string[];
  isPrivate: boolean;
}

interface ImageCardProps {
  image: Image;
  onClick?: (image: Image) => void;
  onUpdate?: (image: Image) => void;
  onSelect?: (image: StoredImage) => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

const ImageCard = ({ image, onClick, onUpdate, onSelect, isSelected, selectionMode }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    // Update like count in localStorage
    if (onUpdate) {
      // We're passing the updated image to parent component to handle the like
      onUpdate({...image, likes: liked ? image.likes - 1 : image.likes + 1});
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Will implement share functionality later
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Will implement download functionality later
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Will implement delete functionality later
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Will implement edit functionality later
  };
  
  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(image as any);
    } else if (onClick) {
      onClick(image);
    }
  };
  
  const formattedDate = new Date(image.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden shadow-md bg-white ${isSelected ? 'ring-4 ring-purple-500' : ''}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Selection indicator */}
      {selectionMode && (
        <div className={`absolute top-2 right-2 z-20 w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'} flex items-center justify-center`}>
          {isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
      
      {/* Private badge */}
      {image.isPrivate && (
        <div className="absolute top-2 left-2 z-10 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          Riêng tư
        </div>
      )}
      
      {/* Image */}
      <div className="relative aspect-auto overflow-hidden">
        <img 
          src={image.url} 
          alt={image.title} 
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        {/* Overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-0 flex flex-col justify-between p-4"
          animate={{ backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)' }}
        >
          {/* Top action buttons */}
          <div className="flex justify-end space-x-2 opacity-0" style={{ opacity: isHovered ? 1 : 0 }}>
            <button 
              className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
              onClick={handleEdit}
            >
              <FiEdit className="text-gray-700" />
            </button>
            <button 
              className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
              onClick={handleDelete}
            >
              <FiTrash2 className="text-red-500" />
            </button>
          </div>
          
          {/* Bottom info */}
          <div>
            <h3 
              className="text-white text-lg font-semibold mb-1 drop-shadow-md"
              style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}
            >
              {image.title}
            </h3>
            <div 
              className="flex flex-wrap gap-1 mb-2"
              style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}
            >
              {image.tags.map((tag, index) => (
                <span key={index} className="bg-purple-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Card footer */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          <div className="flex space-x-2">
            <button 
              className={`p-1.5 rounded-full transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              onClick={handleLike}
            >
              <FiHeart className={liked ? 'fill-current' : ''} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-blue-500 rounded-full transition-colors"
              onClick={handleShare}
            >
              <FiShare2 />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-green-500 rounded-full transition-colors"
              onClick={handleDownload}
            >
              <FiDownload />
            </button>
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-500">
          {image.likes} lượt thích
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
