import React, { useState, useEffect } from 'react';
import { FiThumbsUp, FiBarChart2, FiUsers, FiAward } from 'react-icons/fi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';

interface VotingGalleryProps {
  images: {
    id: string;
    url: string;
    title: string;
    votes?: number;
    hasVoted?: boolean;
  }[];
  onVote: (imageId: string) => void;
}

const VotingGallery: React.FC<VotingGalleryProps> = ({
  images,
  onVote
}) => {
  const [votedImages, setVotedImages] = useState<Record<string, boolean>>({});
  const [sortedImages, setSortedImages] = useState([...images]);
  const [isVotingActive, setIsVotingActive] = useState(true);
  const [votingEndTime, setVotingEndTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { showToast } = useToast();
  
  // Initialize voted images from localStorage
  useEffect(() => {
    const storedVotes = localStorage.getItem('votedImages');
    if (storedVotes) {
      setVotedImages(JSON.parse(storedVotes));
    }
    
    // For demo purposes, set a voting end time 24 hours from now if not set
    const storedEndTime = localStorage.getItem('votingEndTime');
    if (storedEndTime) {
      setVotingEndTime(new Date(storedEndTime));
    } else {
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 24);
      setVotingEndTime(endTime);
      localStorage.setItem('votingEndTime', endTime.toISOString());
    }
  }, []);
  
  // Update time remaining
  useEffect(() => {
    if (!votingEndTime) return;
    
    const updateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(votingEndTime);
      
      if (now >= endTime) {
        setIsVotingActive(false);
        setTimeRemaining('Đã kết thúc');
        return;
      }
      
      const diffMs = endTime.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${diffHrs}h ${diffMins}m`);
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [votingEndTime]);
  
  // Sort images by votes
  useEffect(() => {
    const updatedImages = images.map(img => ({
      ...img,
      votes: img.votes || 0,
      hasVoted: votedImages[img.id] || false
    }));
    
    const sorted = [...updatedImages].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    setSortedImages(sorted);
  }, [images, votedImages]);
  
  const handleVote = (imageId: string) => {
    if (!isVotingActive) {
      showToast('Bình chọn đã kết thúc', 'warning');
      return;
    }
    
    if (votedImages[imageId]) {
      showToast('Bạn đã bình chọn cho ảnh này rồi', 'warning');
      return;
    }
    
    // Update local state
    setVotedImages(prev => {
      const updated = { ...prev, [imageId]: true };
      localStorage.setItem('votedImages', JSON.stringify(updated));
      return updated;
    });
    
    // Call parent handler to update votes in database
    onVote(imageId);
    
    showToast('Bình chọn thành công!', 'success');
  };
  
  const getTopThreeImages = () => {
    return sortedImages.slice(0, 3);
  };
  
  const getRankLabel = (index: number) => {
    switch (index) {
      case 0: return { text: 'Hạng nhất', color: 'text-yellow-500', icon: '🥇' };
      case 1: return { text: 'Hạng nhì', color: 'text-gray-400', icon: '🥈' };
      case 2: return { text: 'Hạng ba', color: 'text-amber-600', icon: '🥉' };
      default: return { text: `Hạng ${index + 1}`, color: 'text-gray-600', icon: '' };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <FiAward className="text-purple-600 mr-2 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Bình chọn ảnh đẹp nhất</h2>
        </div>
        
        <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
          <FiBarChart2 className="mr-1" />
          <span className="text-sm font-medium">
            {isVotingActive 
              ? `Còn lại: ${timeRemaining}` 
              : 'Đã kết thúc bình chọn'}
          </span>
        </div>
      </div>
      
      {/* Top 3 images */}
      {!isVotingActive && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Kết quả bình chọn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getTopThreeImages().map((image, index) => {
              const rank = getRankLabel(index);
              return (
                <AnimatedContainer 
                  key={image.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden"
                  delay={index * 0.1}
                >
                  <div className="absolute top-2 left-2 z-10 flex items-center bg-white bg-opacity-90 px-2 py-1 rounded-full">
                    <span className="mr-1">{rank.icon}</span>
                    <span className={`text-sm font-bold ${rank.color}`}>{rank.text}</span>
                  </div>
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 truncate">{image.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-purple-600">
                        <FiThumbsUp className="mr-1" />
                        <span className="font-bold">{image.votes}</span>
                        <span className="ml-1 text-sm text-gray-600">bình chọn</span>
                      </div>
                    </div>
                  </div>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      )}
      
      {/* All images for voting */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedImages.map((image, index) => (
          <AnimatedContainer 
            key={image.id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
            delay={index * 0.05}
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h4 className="font-medium text-gray-800 truncate">{image.title}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-gray-600">
                  <FiThumbsUp className="mr-1" />
                  <span>{image.votes}</span>
                </div>
                
                {isVotingActive && (
                  <Button
                    variant={image.hasVoted ? "outline" : "primary"}
                    size="sm"
                    onClick={() => handleVote(image.id)}
                    disabled={image.hasVoted}
                  >
                    {image.hasVoted ? 'Đã bình chọn' : 'Bình chọn'}
                  </Button>
                )}
              </div>
            </div>
          </AnimatedContainer>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <p>
          {isVotingActive 
            ? 'Mỗi người chỉ được bình chọn một lần cho mỗi ảnh. Kết quả sẽ được công bố sau khi kết thúc thời gian bình chọn.'
            : 'Bình chọn đã kết thúc. Cảm ơn bạn đã tham gia!'}
        </p>
      </div>
    </div>
  );
};

export default VotingGallery;
