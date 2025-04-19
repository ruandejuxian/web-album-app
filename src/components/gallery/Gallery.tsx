import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { FiSearch, FiFilter, FiChevronDown, FiDownload } from 'react-icons/fi';
import ImageCard from './ImageCard';
import { useLocalStorage, StoredImage } from '../../hooks/useStorage/useLocalStorage';
import MultiDownloadPanel from './MultiDownloadPanel';
import AdvancedSearch, { SearchParams } from './AdvancedSearch';
import SortingOptions from './SortingOptions';

// Temporary type for images until we implement the actual data fetching
interface Image {
  id: string;
  url: string;
  title: string;
  likes: number;
  date: string;
  tags: string[];
  isPrivate: boolean;
  description?: string;
}

interface GalleryProps {
  onImageClick?: (image: Image) => void;
  onImageUpdate?: (image: Image) => void;
}

const Gallery = ({ onImageClick, onImageUpdate }: GalleryProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedImages, setSelectedImages] = useState<StoredImage[]>([]);
  const [showMultiDownload, setShowMultiDownload] = useState(false);
  const [advancedSearchParams, setAdvancedSearchParams] = useState<SearchParams>({
    term: '',
    tags: [],
    dateRange: {
      from: null,
      to: null
    },
    isPrivate: null
  });
  
  // Load images from localStorage
  const { getAllImages, loading: storageLoading, updateImage } = useLocalStorage();
  
  useEffect(() => {
    // Get all images from localStorage
    const storedImages = getAllImages();
    
    if (storedImages.length > 0) {
      setImages(storedImages as any[]);
    } else {
      // If no images in localStorage, use dummy data for demo
      const dummyImages: Image[] = [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
          title: 'Phong cảnh thiên nhiên',
          likes: 24,
          date: '2023-05-10T08:30:00Z',
          tags: ['thiên nhiên', 'phong cảnh'],
          isPrivate: false,
          description: 'Khung cảnh thiên nhiên tuyệt đẹp với núi non hùng vĩ'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1',
          title: 'Bãi biển hoàng hôn',
          likes: 18,
          date: '2023-05-15T16:45:00Z',
          tags: ['biển', 'hoàng hôn'],
          isPrivate: true,
          description: 'Hoàng hôn trên bãi biển với những gam màu tuyệt đẹp'
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
          title: 'Thành phố về đêm',
          likes: 32,
          date: '2023-05-20T21:15:00Z',
          tags: ['thành phố', 'đêm'],
          isPrivate: false,
          description: 'Thành phố lung linh ánh đèn trong đêm tối'
        }
      ];
      
      setImages(dummyImages);
    }
  }, [getAllImages]);
  
  // Handle image selection for multi-download
  const toggleImageSelection = (image: StoredImage) => {
    setSelectedImages(prev => {
      const isSelected = prev.some(img => img.id === image.id);
      if (isSelected) {
        return prev.filter(img => img.id !== image.id);
      } else {
        return [...prev, image];
      }
    });
  };
  
  // Clear all selected images
  const clearSelectedImages = () => {
    setSelectedImages([]);
  };
  
  // Handle image update (like, comment, etc.)
  const handleImageUpdate = (updatedImage: StoredImage) => {
    // Update in localStorage
    updateImage(updatedImage.id, updatedImage);
    
    // Update in local state
    setImages(prev => 
      prev.map(img => img.id === updatedImage.id ? updatedImage as any : img)
    );
    
    // Pass to parent if provided
    if (onImageUpdate) {
      onImageUpdate(updatedImage as any);
    }
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };
  
  // Handle view mode change
  const handleViewChange = (newViewMode: 'grid' | 'list') => {
    setViewMode(newViewMode);
  };
  
  // Handle sort direction change
  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  };
  
  // Handle advanced search
  const handleAdvancedSearch = (params: SearchParams) => {
    setAdvancedSearchParams(params);
    // Update basic search term to match advanced search term
    setSearchTerm(params.term);
    // Update filter based on privacy setting
    if (params.isPrivate === true) {
      setSelectedFilter('private');
    } else if (params.isPrivate === false) {
      setSelectedFilter('public');
    } else {
      setSelectedFilter('all');
    }
  };
  
  // Filter images based on search term, selected filter, and advanced search params
  const filteredImages = images.filter(image => {
    // Basic text search in title and tags
    const matchesSearch = (image.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))));
    
    // Basic privacy filter
    let matchesPrivacy = true;
    if (selectedFilter === 'private') matchesPrivacy = image.isPrivate;
    else if (selectedFilter === 'public') matchesPrivacy = !image.isPrivate;
    
    // Advanced search filters
    let matchesTags = true;
    if (advancedSearchParams.tags.length > 0) {
      matchesTags = advancedSearchParams.tags.every(tag => 
        image.tags && image.tags.some(imageTag => imageTag.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    // Date range filter
    let matchesDateRange = true;
    const imageDate = new Date(image.date);
    if (advancedSearchParams.dateRange.from) {
      const fromDate = new Date(advancedSearchParams.dateRange.from);
      matchesDateRange = matchesDateRange && imageDate >= fromDate;
    }
    if (advancedSearchParams.dateRange.to) {
      const toDate = new Date(advancedSearchParams.dateRange.to);
      matchesDateRange = matchesDateRange && imageDate <= toDate;
    }
    
    return matchesSearch && matchesPrivacy && matchesTags && matchesDateRange;
  });
  
  // Sort images based on selected sort option and direction
  const sortedImages = [...filteredImages].sort((a, b) => {
    let result = 0;
    
    if (sortBy === 'date') {
      result = new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'likes') {
      result = b.likes - a.likes;
    } else if (sortBy === 'title') {
      result = a.title.localeCompare(b.title);
    } else if (sortBy === 'views') {
      // For now, we'll just use likes as a proxy for views
      result = b.likes - a.likes;
    }
    
    // Reverse the result if sort direction is ascending
    return sortDirection === 'asc' ? -result : result;
  });
  
  // Breakpoints for masonry layout
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };
  
  return (
    <div className="gallery-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bộ sưu tập ảnh</h1>
        <p className="text-gray-600">Khám phá và chia sẻ những khoảnh khắc đẹp</p>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tìm kiếm theo tên hoặc tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <FiFilter className="mr-2" />
                  <span>
                    {selectedFilter === 'all' && 'Tất cả ảnh'}
                    {selectedFilter === 'private' && 'Ảnh riêng tư'}
                    {selectedFilter === 'public' && 'Ảnh công khai'}
                  </span>
                </div>
                <FiChevronDown />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${selectedFilter === 'all' ? 'bg-purple-50 text-purple-700' : ''}`}
                      onClick={() => {
                        setSelectedFilter('all');
                        setIsFilterOpen(false);
                      }}
                    >
                      Tất cả ảnh
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${selectedFilter === 'private' ? 'bg-purple-50 text-purple-700' : ''}`}
                      onClick={() => {
                        setSelectedFilter('private');
                        setIsFilterOpen(false);
                      }}
                    >
                      Ảnh riêng tư
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${selectedFilter === 'public' ? 'bg-purple-50 text-purple-700' : ''}`}
                      onClick={() => {
                        setSelectedFilter('public');
                        setIsFilterOpen(false);
                      }}
                    >
                      Ảnh công khai
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Multi-select mode toggle */}
            {selectedImages.length > 0 ? (
              <button
                onClick={() => setShowMultiDownload(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <FiDownload className="mr-2" />
                Tải xuống ({selectedImages.length})
              </button>
            ) : (
              <button
                onClick={() => setSelectedImages([])}
                className={`flex items-center px-4 py-2 border rounded-lg ${selectedImages.length > 0 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <FiDownload className="mr-2" />
                Chọn nhiều
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Sorting options */}
      <SortingOptions 
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        currentSort={sortBy}
        currentView={viewMode}
      />
      
      {/* Advanced search */}
      <AdvancedSearch 
        onSearch={handleAdvancedSearch}
        initialParams={advancedSearchParams}
      />
      
      {/* Gallery grid */}
      {storageLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : sortedImages.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Không tìm thấy ảnh nào</p>
        </div>
      ) : viewMode === 'grid' ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {sortedImages.map((image) => (
            <div key={image.id} className="mb-4">
              <ImageCard 
                image={image} 
                onClick={onImageClick} 
                onUpdate={handleImageUpdate}
                onSelect={toggleImageSelection}
                isSelected={selectedImages.some(img => img.id === image.id)}
                selectionMode={selectedImages.length > 0}
              />
            </div>
          ))}
        </Masonry>
      ) : (
        <div className="space-y-4">
          {sortedImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48">
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-3/4 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{image.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {image.tags && image.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{image.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(image.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                        onClick={() => handleImageUpdate({...image as any, likes: image.likes + 1})}
                      >
                        <FiHeart /> <span>{image.likes}</span>
                      </button>
                      <button 
                        className="p-1.5 text-gray-500 hover:text-blue-500 rounded-full transition-colors"
                        onClick={() => onImageClick && onImageClick(image)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Multi-download panel */}
      <AnimatePresence>
        {showMultiDownload && (
          <MultiDownloadPanel
            selectedImages={selectedImages}
            onClose={() => setShowMultiDownload(false)}
            onClearSelection={clearSelectedImages}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
