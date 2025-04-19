import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiTag, FiX } from 'react-icons/fi';

interface AdvancedSearchProps {
  onSearch: (searchParams: SearchParams) => void;
  initialParams?: SearchParams;
}

export interface SearchParams {
  term: string;
  tags: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  isPrivate: boolean | null;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, initialParams }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean | null>(null);
  
  // Popular tags (in a real app, these would come from the backend)
  const popularTags = ['thiên nhiên', 'phong cảnh', 'biển', 'hoàng hôn', 'thành phố', 'đêm', 'chân dung', 'du lịch', 'ẩm thực'];
  
  // Initialize with initial params if provided
  useEffect(() => {
    if (initialParams) {
      setSearchTerm(initialParams.term || '');
      setSelectedTags(initialParams.tags || []);
      setDateFrom(initialParams.dateRange?.from || null);
      setDateTo(initialParams.dateRange?.to || null);
      setIsPrivate(initialParams.isPrivate);
    }
  }, [initialParams]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleSelectPopularTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSearch = () => {
    onSearch({
      term: searchTerm,
      tags: selectedTags,
      dateRange: {
        from: dateFrom,
        to: dateTo
      },
      isPrivate
    });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setTagInput('');
    setDateFrom(null);
    setDateTo(null);
    setIsPrivate(null);
    
    onSearch({
      term: '',
      tags: [],
      dateRange: {
        from: null,
        to: null
      },
      isPrivate: null
    });
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-purple-600 font-medium flex items-center"
        >
          <FiSearch className="mr-2" />
          {isOpen ? 'Đóng tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}
        </button>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ khóa tìm kiếm
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại ảnh
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                value={isPrivate === null ? '' : isPrivate ? 'private' : 'public'}
                onChange={(e) => {
                  if (e.target.value === '') setIsPrivate(null);
                  else setIsPrivate(e.target.value === 'private');
                }}
              >
                <option value="">Tất cả</option>
                <option value="private">Ảnh riêng tư</option>
                <option value="public">Ảnh công khai</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <FiTag className="mr-1" /> Tags
              </div>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <div key={tag} className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Thêm tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                onClick={handleAddTag}
                className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700"
                disabled={!tagInput.trim()}
              >
                Thêm
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Tags phổ biến:</p>
              <div className="flex flex-wrap gap-1">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectPopularTag(tag)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> Từ ngày
                </div>
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                value={dateFrom || ''}
                onChange={(e) => setDateFrom(e.target.value || null)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> Đến ngày
                </div>
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                value={dateTo || ''}
                onChange={(e) => setDateTo(e.target.value || null)}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Đặt lại
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Tìm kiếm
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedSearch;
