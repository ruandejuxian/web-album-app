import { StoredImage } from '../../hooks/useStorage/useLocalStorage';

// Function to upload a file to Google Drive
export const uploadFileToDrive = async (file: File): Promise<string> => {
  try {
    // Create a new file metadata
    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    // Convert file to base64 for upload
    const base64Data = await fileToBase64(file);
    const fileContent = base64Data.split(',')[1]; // Remove the data URL prefix

    // Create a multipart request to upload the file
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + file.type + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      fileContent +
      closeDelimiter;

    // Upload the file
    const response = await window.gapi.client.request({
      path: 'https://www.googleapis.com/upload/drive/v3/files',
      method: 'POST',
      params: {
        uploadType: 'multipart',
        fields: 'id,webViewLink,webContentLink',
      },
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    // Make the file publicly accessible
    await makeFilePublic(response.result.id);

    // Return the direct link to the file
    return `https://drive.google.com/uc?export=view&id=${response.result.id}`;
  } catch (error) {
    console.error('Error uploading file to Drive:', error);
    throw error;
  }
};

// Function to make a file publicly accessible
export const makeFilePublic = async (fileId: string): Promise<void> => {
  try {
    await window.gapi.client.drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (error) {
    console.error('Error making file public:', error);
    throw error;
  }
};

// Function to get a direct link to a Google Drive file
export const getDriveFileLink = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

// Function to extract file ID from a Google Drive link
export const extractDriveFileId = (driveLink: string): string | null => {
  // Handle different formats of Google Drive links
  const patterns = [
    /\/file\/d\/([^\/]+)/,  // https://drive.google.com/file/d/FILE_ID/...
    /id=([^&]+)/,           // https://drive.google.com/open?id=FILE_ID
    /\/d\/([^\/]+)/,        // https://drive.google.com/d/FILE_ID/...
  ];

  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Function to convert a Google Drive link to a direct image link
export const convertDriveLinkToDirectLink = (driveLink: string): string | null => {
  const fileId = extractDriveFileId(driveLink);
  if (!fileId) {
    return null;
  }
  return getDriveFileLink(fileId);
};

// Function to download a file from Google Drive
export const downloadDriveFile = async (fileId: string): Promise<Blob> => {
  try {
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
    return await response.blob();
  } catch (error) {
    console.error('Error downloading file from Drive:', error);
    throw error;
  }
};

// Function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Function to compress an image
export const compressImage = async (file: File, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Maintain aspect ratio
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

// Function to download an image with specified quality
export const downloadImageWithQuality = async (
  image: StoredImage,
  quality: 'low' | 'medium' | 'original'
): Promise<void> => {
  try {
    // Fetch the image
    const response = await fetch(image.url);
    const blob = await response.blob();
    
    // Create a File object
    const file = new File([blob], `${image.title}.jpg`, { type: blob.type });
    
    let finalBlob: Blob;
    
    // Compress based on quality
    if (quality === 'low') {
      finalBlob = await compressImage(file, 0.3); // ~100KB
    } else if (quality === 'medium') {
      finalBlob = await compressImage(file, 0.7); // ~500KB
    } else {
      finalBlob = blob; // Original quality
    }
    
    // Create download link
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.title}_${quality}.jpg`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};
