import { useState, useEffect } from 'react';

// Define types for our image data
export interface StoredImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  date: string;
  likes: number;
  isPrivate: boolean;
}

// Key for localStorage
const STORAGE_KEY = 'photo_album_images';

export const useLocalStorage = () => {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load images from localStorage on component mount
  useEffect(() => {
    try {
      const storedImages = localStorage.getItem(STORAGE_KEY);
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading images from localStorage:', err);
      setError('Không thể tải ảnh từ bộ nhớ cục bộ');
      setLoading(false);
    }
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      } catch (err) {
        console.error('Error saving images to localStorage:', err);
        setError('Không thể lưu ảnh vào bộ nhớ cục bộ');
      }
    }
  }, [images, loading]);

  // Add a new image
  const addImage = (image: Omit<StoredImage, 'id'>) => {
    const newImage: StoredImage = {
      ...image,
      id: Date.now().toString(), // Generate a unique ID
    };
    setImages(prevImages => [...prevImages, newImage]);
    return newImage;
  };

  // Update an existing image
  const updateImage = (id: string, updates: Partial<StoredImage>) => {
    setImages(prevImages => 
      prevImages.map(image => 
        image.id === id ? { ...image, ...updates } : image
      )
    );
  };

  // Delete an image
  const deleteImage = (id: string) => {
    setImages(prevImages => prevImages.filter(image => image.id !== id));
  };

  // Get all images
  const getAllImages = () => {
    return images;
  };

  // Get private images
  const getPrivateImages = () => {
    return images.filter(image => image.isPrivate);
  };

  // Get public images
  const getPublicImages = () => {
    return images.filter(image => !image.isPrivate);
  };

  // Get image by ID
  const getImageById = (id: string) => {
    return images.find(image => image.id === id) || null;
  };

  // Like an image
  const likeImage = (id: string) => {
    setImages(prevImages => 
      prevImages.map(image => 
        image.id === id ? { ...image, likes: image.likes + 1 } : image
      )
    );
  };

  // Search images by title or tags
  const searchImages = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return images.filter(image => 
      image.title.toLowerCase().includes(lowerQuery) || 
      image.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    getAllImages,
    getPrivateImages,
    getPublicImages,
    getImageById,
    likeImage,
    searchImages
  };
};
