import React, { useState, useEffect } from 'react';
import { FiImage, FiLayers, FiFolder } from 'react-icons/fi';
import { clusterImagesWithHuggingFace } from '../../api/aiServices';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';

interface AIAlbumCreatorProps {
  images: {
    id: string;
    url: string;
    title: string;
  }[];
  onAlbumsCreated?: (albums: Album[]) => void;
}

interface Album {
  id: string;
  name: string;
  images: string[]; // image URLs
}

const AIAlbumCreator: React.FC<AIAlbumCreatorProps> = ({
  images,
  onAlbumsCreated
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const { showToast } = useToast();
  
  // Load API key from environment or localStorage
  useEffect(() => {
    // In a real app, this would come from environment variables
    // For demo purposes, we'll check localStorage
    const storedApiKey = localStorage.getItem('huggingface_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // For demo, set a placeholder
      setApiKey('YOUR_HUGGINGFACE_API_KEY');
    }
  }, []);
  
  // Create albums with Hugging Face API
  const createAlbums = async () => {
    if (!apiKey || apiKey === 'YOUR_HUGGINGFACE_API_KEY') {
      showToast('Vui lòng cấu hình Hugging Face API Key', 'warning');
      return;
    }
    
    if (images.length < 3) {
      showToast('Cần ít nhất 3 ảnh để tạo album', 'warning');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // In a real app, this would call the actual API
      // For demo purposes, we'll simulate the response
      let result;
      
      if (process.env.NODE_ENV === 'production') {
        result = await clusterImagesWithHuggingFace(
          images.map(img => img.url),
          apiKey
        );
      } else {
        // Simulate API response for development
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = simulateAlbumCreation();
      }
      
      setAlbums(result);
      
      // Notify parent component
      if (onAlbumsCreated) {
        onAlbumsCreated(result);
      }
      
      showToast(`Đã tạo ${result.length} album thành công!`, 'success');
    } catch (error) {
      console.error('Error creating albums:', error);
      showToast('Không thể tạo album', 'error');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Simulate album creation for development
  const simulateAlbumCreation = (): Album[] => {
    // Group images into 2-3 albums
    const albumCount = Math.min(3, Math.ceil(images.length / 3));
    const albums: Album[] = [];
    
    const themes = [
      'Phong cảnh thiên nhiên',
      'Chân dung con người',
      'Ẩm thực Việt Nam',
      'Kiến trúc đô thị',
      'Khoảnh khắc đời thường'
    ];
    
    // Create random groups
    const shuffledImages = [...images].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < albumCount; i++) {
      const imagesPerAlbum = Math.ceil(shuffledImages.length / albumCount);
      const startIdx = i * imagesPerAlbum;
      const endIdx = Math.min(startIdx + imagesPerAlbum, shuffledImages.length);
      const albumImages = shuffledImages.slice(startIdx, endIdx);
      
      albums.push({
        id: `album-${i + 1}`,
        name: themes[i % themes.length],
        images: albumImages.map(img => img.url)
      });
    }
    
    return albums;
  };
  
  return (
    <AnimatedContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiFolder className="text-purple-600 mr-2" />
          <h3 className="font-medium text-gray-800">Tạo album tự động</h3>
        </div>
        
        <Button 
          onClick={createAlbums} 
          disabled={isCreating || images.length < 3}
          variant="outline" 
          size="sm"
          icon={<FiLayers />}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo album'}
        </Button>
      </div>
      
      {albums.length > 0 ? (
        <div className="space-y-4">
          {albums.map((album) => (
            <div 
              key={album.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-800">{album.name}</h4>
                <p className="text-sm text-gray-500">{album.images.length} ảnh</p>
              </div>
              
              <div className="p-3 grid grid-cols-3 gap-2">
                {album.images.slice(0, 6).map((imageUrl, index) => (
                  <div 
                    key={`${album.id}-${index}`}
                    className="aspect-square rounded overflow-hidden"
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Album ${album.name} - Ảnh ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {album.images.length > 6 && (
                  <div className="aspect-square rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">+{album.images.length - 6}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {isCreating ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mb-2"></div>
              <p>Đang phân tích và nhóm ảnh...</p>
            </div>
          ) : (
            <p>Nhấn "Tạo album" để nhóm ảnh theo chủ đề tự động</p>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Sử dụng Hugging Face API để phân tích và nhóm ảnh theo chủ đề tương tự nhau.
      </div>
    </AnimatedContainer>
  );
};

export default AIAlbumCreator;
