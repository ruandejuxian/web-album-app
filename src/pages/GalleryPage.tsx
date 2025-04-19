import React, { useState } from 'react';
import Gallery from '../gallery/Gallery';
import ImageModal from '../modal/ImageModal';
import { useLocalStorage, StoredImage } from '../../hooks/useStorage/useLocalStorage';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateImage } = useLocalStorage();

  const handleImageClick = (image: StoredImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle image updates (like, comment, etc.)
  const handleImageUpdate = (updatedImage: StoredImage) => {
    if (updatedImage.id) {
      // Update the image in localStorage
      updateImage(updatedImage.id, updatedImage);
      
      // Update the selected image if it's currently displayed in modal
      if (selectedImage && selectedImage.id === updatedImage.id) {
        setSelectedImage(updatedImage);
      }
    }
  };

  return (
    <div>
      <Gallery onImageClick={handleImageClick} onImageUpdate={handleImageUpdate} />
      <ImageModal 
        image={selectedImage} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onImageUpdate={handleImageUpdate}
      />
    </div>
  );
};

export default GalleryPage;
