import React, { useState, useEffect } from 'react';
import { FiGrid, FiList, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import AnimatedContainer from '../ui/AnimatedContainer';

interface ResponsiveGalleryViewProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ResponsiveGalleryView: React.FC<ResponsiveGalleryViewProps> = ({
  children,
  title = 'Thư viện ảnh',
  description = 'Khám phá bộ sưu tập ảnh của bạn'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            placeholder="Tìm kiếm ảnh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
          
          <button
            className={`p-2 border rounded-lg ${isFilterOpen ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={toggleFilter}
            aria-label="Filter"
          >
            <FiFilter />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Panel (Responsive) */}
        {isFilterOpen && (
          <AnimatedContainer className="md:w-64 bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Bộ lọc</h3>
              {isMobile && (
                <button
                  onClick={toggleFilter}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              )}
            </div>
            
            {/* Filter Content */}
            <div className="space-y-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <div className="space-y-1">
                  {['Phong cảnh', 'Chân dung', 'Ẩm thực', 'Động vật', 'Kiến trúc'].map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thẻ phổ biến
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Biển', 'Núi', 'Thành phố', 'Gia đình', 'Du lịch'].map((tag) => (
                    <button
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-purple-100 hover:text-purple-800"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContainer>
        )}
        
        {/* Gallery Content */}
        <div className={`flex-grow ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveGalleryView;
