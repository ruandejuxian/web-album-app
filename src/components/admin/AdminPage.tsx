import React from 'react';
import { FiSettings, FiCheckCircle, FiXCircle, FiImage, FiAlertCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getPendingImages, approveImage, rejectImage, SheetImageData } from '../../lib/api/googleSheets';
import { isSignedIn } from '../../lib/api/googleAuth';

const AdminPage = () => {
  const [pendingImages, setPendingImages] = useState<SheetImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = isSignedIn();
    setAuthenticated(authStatus);

    if (authStatus) {
      loadPendingImages();
    } else {
      setLoading(false);
    }
  }, []);

  const loadPendingImages = async () => {
    try {
      setLoading(true);
      const images = await getPendingImages();
      setPendingImages(images);
      setError(null);
    } catch (err) {
      console.error('Error loading pending images:', err);
      setError('Không thể tải ảnh đang chờ duyệt. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (imageId: string) => {
    try {
      setProcessingImageId(imageId);
      await approveImage(imageId);
      setPendingImages(prevImages => prevImages.filter(img => img.id !== imageId));
      setError(null);
    } catch (err) {
      console.error('Error approving image:', err);
      setError('Không thể duyệt ảnh. Vui lòng thử lại sau.');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleReject = async (imageId: string) => {
    try {
      setProcessingImageId(imageId);
      await rejectImage(imageId);
      setPendingImages(prevImages => prevImages.filter(img => img.id !== imageId));
      setError(null);
    } catch (err) {
      console.error('Error rejecting image:', err);
      setError('Không thể từ chối ảnh. Vui lòng thử lại sau.');
    } finally {
      setProcessingImageId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bạn cần đăng nhập để truy cập trang quản trị.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiSettings className="mr-2" /> Trang quản trị
        </h1>
        <button
          onClick={loadPendingImages}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Ảnh đang chờ duyệt</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải ảnh...</p>
          </div>
        ) : pendingImages.length === 0 ? (
          <div className="p-6 text-center">
            <FiImage className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Không có ảnh nào đang chờ duyệt.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingImages.map((image) => (
              <div key={image.id} className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-48 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{image.title}</h3>
                    <p className="text-gray-600 mb-2">{image.description || 'Không có mô tả.'}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {image.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <p>Ngày tải lên: {new Date(image.date).toLocaleDateString('vi-VN')}</p>
                      <p>Người tải lên: {image.userName}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(image.id)}
                        disabled={processingImageId === image.id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FiCheckCircle className="mr-2" />
                        {processingImageId === image.id ? 'Đang xử lý...' : 'Duyệt'}
                      </button>
                      <button
                        onClick={() => handleReject(image.id)}
                        disabled={processingImageId === image.id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FiXCircle className="mr-2" />
                        {processingImageId === image.id ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
