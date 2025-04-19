import axios from 'axios';

// Google Vision API for image content recognition
export const analyzeImageWithVision = async (imageUrl: string, apiKey: string) => {
  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl
              }
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10
              },
              {
                type: 'WEB_DETECTION',
                maxResults: 10
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10
              }
            ]
          }
        ]
      }
    );

    return {
      labels: response.data.responses[0]?.labelAnnotations || [],
      webEntities: response.data.responses[0]?.webDetection?.webEntities || [],
      objects: response.data.responses[0]?.localizedObjectAnnotations || []
    };
  } catch (error) {
    console.error('Error analyzing image with Google Vision API:', error);
    throw new Error('Failed to analyze image with Google Vision API');
  }
};

// Hugging Face API for image captioning and album creation
export const getImageCaptionWithHuggingFace = async (imageUrl: string, apiKey: string) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
      { url: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data[0]?.generated_text || 'No caption available';
  } catch (error) {
    console.error('Error getting image caption with Hugging Face API:', error);
    throw new Error('Failed to get image caption with Hugging Face API');
  }
};

// Hugging Face API for image clustering (album creation)
export const clusterImagesWithHuggingFace = async (imageUrls: string[], apiKey: string) => {
  try {
    // First, get embeddings for all images using CLIP model
    const embeddings = await Promise.all(
      imageUrls.map(async (url) => {
        const response = await axios.post(
          'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
          { url },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      })
    );

    // Then use a simple clustering algorithm (in a real app, you'd use a more sophisticated approach)
    // For this example, we'll simulate clustering by grouping every 3-5 images
    const albums = [];
    let currentAlbum = [];
    let currentAlbumSize = Math.floor(Math.random() * 3) + 3; // Random size between 3-5

    for (let i = 0; i < imageUrls.length; i++) {
      currentAlbum.push(imageUrls[i]);
      
      if (currentAlbum.length >= currentAlbumSize || i === imageUrls.length - 1) {
        // Get a theme name for the album based on the first image
        const theme = await getImageCaptionWithHuggingFace(currentAlbum[0], apiKey);
        albums.push({
          id: `album-${albums.length + 1}`,
          name: theme,
          images: [...currentAlbum]
        });
        
        currentAlbum = [];
        currentAlbumSize = Math.floor(Math.random() * 3) + 3; // Random size for next album
      }
    }

    return albums;
  } catch (error) {
    console.error('Error clustering images with Hugging Face API:', error);
    throw new Error('Failed to cluster images with Hugging Face API');
  }
};
