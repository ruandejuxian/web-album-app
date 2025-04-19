import { FiHeart, FiGithub, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Photo Album</h3>
            <p className="text-gray-300 mt-2">Chia sẻ khoảnh khắc đẹp của bạn</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Liên kết</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white transition">Trang chủ</a></li>
                <li><a href="/gallery" className="text-gray-300 hover:text-white transition">Bộ sưu tập</a></li>
                <li><a href="/upload" className="text-gray-300 hover:text-white transition">Tải ảnh lên</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Liên hệ</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FiMail className="mr-2" />
                  <a href="mailto:contact@photoalbum.com" className="text-gray-300 hover:text-white transition">
                    contact@photoalbum.com
                  </a>
                </li>
                <li className="flex items-center">
                  <FiGithub className="mr-2" />
                  <a href="https://github.com/photoalbum" className="text-gray-300 hover:text-white transition">
                    github.com/photoalbum
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="flex items-center justify-center text-gray-300">
            Made with <FiHeart className="text-red-500 mx-1" /> by Photo Album Team
          </p>
          <p className="text-gray-400 mt-1">© {new Date().getFullYear()} Photo Album. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
