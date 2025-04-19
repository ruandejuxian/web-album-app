import React, { useState, useEffect } from 'react';
import { FiUser, FiImage, FiHeart, FiUpload, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useLocalStorage, StoredImage } from '../../hooks/useStorage/useLocalStorage';

const ProfilePage = () => {
  const [privateImages, setPrivateImages] = useState<StoredImage[]>([]);
  const { getPrivateImages } = useLocalStorage();
  
  // Load private images from localStorage
  useEffect(() => {
    const images = getPrivateImages();
    if (images && images.length > 0) {
      setPrivateImages(images);
    }
  }, [getPrivateImages]);

  // Dummy user data
  const user = {
    name: 'Người dùng',
    email: 'user@example.com',
    avatar: 'https://source.unsplash.com/random/100x100?portrait',
    stats: {
      uploads: privateImages.length || 0,
      likes: privateImages.reduce((sum, img) => sum + img.likes, 0),
      views: 1024
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trang cá nhân</h1>
        <p className="text-gray-600">Quản lý thông tin và ảnh của bạn</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-center">
            <img 
              className="h-32 w-32 rounded-full border-4 border-white object-cover"
              src={user.avatar}
              alt={user.name}
            />
          </div>
          <div className="p-8 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FiSettings className="mr-2" /> Chỉnh sửa thông tin
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{user.stats.uploads}</span>
                <span className="text-gray-600">Ảnh đã tải</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{user.stats.likes}</span>
                <span className="text-gray-600">Lượt thích</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{user.stats.views}</span>
                <span className="text-gray-600">Lượt xem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <a href="#" className="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <FiImage className="mr-2" /> Ảnh riêng tư
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <FiHeart className="mr-2" /> Ảnh đã thích
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
              <FiUpload className="mr-2" /> Ảnh đang chờ duyệt
            </a>
          </nav>
        </div>
      </div>

      {/* Private images grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {privateImages.map((image) => (
          <motion.div
            key={image.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                Riêng tư
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1">{image.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(image.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more button */}
      <div className="text-center mb-8">
        <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
