import React from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiUsers, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Lưu giữ khoảnh khắc <span className="text-purple-600">đẹp nhất</span> của bạn
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tải lên, lưu trữ và chia sẻ những bức ảnh yêu thích của bạn với mọi người một cách dễ dàng.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center"
              >
                <FiUpload className="mr-2" /> Tải ảnh lên
              </Link>
              <Link
                to="/gallery"
                className="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all flex items-center"
              >
                <FiImage className="mr-2" /> Xem bộ sưu tập
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                  <img src="https://source.unsplash.com/random/600x400?nature" alt="Nature" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                  <img src="https://source.unsplash.com/random/600x400?city" alt="City" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-lg overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                  <img src="https://source.unsplash.com/random/600x400?portrait" alt="Portrait" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                  <img src="https://source.unsplash.com/random/600x400?travel" alt="Travel" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl transform rotate-12 shadow-lg">
              <FiCamera />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-gray-50 rounded-3xl my-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tính năng nổi bật</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những tính năng tuyệt vời giúp bạn quản lý và chia sẻ ảnh một cách hiệu quả
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl mb-4">
              <FiUpload />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tải ảnh đa dạng</h3>
            <p className="text-gray-600">
              Tải ảnh từ máy tính hoặc nhập link Google Drive một cách nhanh chóng và dễ dàng.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl mb-4">
              <FiImage />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quản lý thông minh</h3>
            <p className="text-gray-600">
              Tìm kiếm, sắp xếp và lọc ảnh theo nhiều tiêu chí khác nhau một cách hiệu quả.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl mb-4">
              <FiUsers />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chia sẻ dễ dàng</h3>
            <p className="text-gray-600">
              Chia sẻ ảnh với bạn bè và người thân một cách nhanh chóng thông qua link.
            </p>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Bắt đầu lưu trữ và chia sẻ ảnh ngay hôm nay
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tạo bộ sưu tập ảnh của riêng bạn và chia sẻ những khoảnh khắc đẹp với mọi người.
          </p>
          <Link
            to="/upload"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg inline-flex items-center"
          >
            <FiUpload className="mr-2" /> Bắt đầu ngay
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
