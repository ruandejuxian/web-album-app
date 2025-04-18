import { useState } from 'react';
import { StoredImage } from '../../hooks/useStorage/useLocalStorage';

// Utility function to convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Utility function to extract image metadata
export const extractImageMetadata = async (file: File): Promise<Partial<StoredImage>> => {
  const url = await fileToBase64(file);
  
  return {
    url,
    title: file.name.split('.')[0], // Use filename as title
    date: new Date().toISOString(),
    likes: 0,
    tags: [],
    isPrivate: true, // Default to private
  };
};

// Utility function to validate Google Drive link
export const validateDriveLink = (link: string): boolean => {
  // Simple validation for demonstration
  return link.includes('drive.google.com');
};

// Utility function to extract image ID from Google Drive link
export const extractDriveImageId = (link: string): string | null => {
  // Simple extraction for demonstration
  const match = link.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
  return match ? (match[1] || match[2]) : null;
};

// Utility function to convert Drive link to direct image link
export const convertDriveLinkToImageUrl = (link: string): string => {
  const id = extractDriveImageId(link);
  if (!id) return '';
  
  // For demonstration, we'll just return a placeholder image
  // In a real implementation, this would use the Google Drive API
  return `https://drive.google.com/uc?export=view&id=${id}`;
};
