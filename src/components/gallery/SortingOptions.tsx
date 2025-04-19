import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiGrid, FiList } from 'react-icons/fi';

interface SortingOptionsProps {
  onSortChange: (sortBy: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentSort: string;
  currentView: 'grid' | 'list';
}

const SortingOptions: React.FC<SortingOptionsProps> = ({
  onSortChange,
  onViewChange,
  currentSort,
  currentView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortOptions = [
    { value: 'date', label: 'Ngày tải lên' },
    { value: 'title', label: 'Tên ảnh' },
    { value: 'likes', label: 'Lượt thích' },
    { value: 'views', label: 'Lượt xem' }
  ];

  const handleSortChange = (sortBy: string) => {
    onSortChange(sortBy);
    setIsOpen(false);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    // Reverse the current sort order
    onSortChange(`${currentSort.replace(/^-/, '')}${newDirection === 'desc' ? '' : '-'}`);
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[140px]"
        >
          <span>
            {sortOptions.find(option => option.value === currentSort.replace(/^-/, ''))?.label || 'Sắp xếp theo'}
          </span>
          <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentSort.replace(/^-/, '') === option.value
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <button
        onClick={toggleSortDirection}
        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        title={sortDirection === 'asc' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
      >
        {sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
      </button>

      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => onViewChange('grid')}
          className={`p-2 ${
            currentView === 'grid'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Xem dạng lưới"
        >
          <FiGrid />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`p-2 ${
            currentView === 'list'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Xem dạng danh sách"
        >
          <FiList />
        </button>
      </div>
    </div>
  );
};

export default SortingOptions;
