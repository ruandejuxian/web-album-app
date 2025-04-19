import React, { useState, useEffect } from 'react';
import { FiImage, FiTag, FiEye, FiBarChart2, FiClock, FiShare2 } from 'react-icons/fi';
import { analyzeImageWithVision } from '../../api/aiServices';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';

interface AIImageAnalyzerProps {
  imageUrl: string;
  onTagsGenerated?: (tags: string[]) => void;
}

interface Tag {
  name: string;
  score: number;
  source: 'label' | 'web' | 'object';
}

const AIImageAnalyzer: React.FC<AIImageAnalyzerProps> = ({
  imageUrl,
  onTagsGenerated
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const { showToast } = useToast();
  
  // Load API key from environment or localStorage
  useEffect(() => {
    // In a real app, this would come from environment variables
    // For demo purposes, we'll check localStorage
    const storedApiKey = localStorage.getItem('google_vision_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // For demo, set a placeholder
      setApiKey('YOUR_GOOGLE_VISION_API_KEY');
    }
  }, []);
  
  // Analyze image with Google Vision API
  const analyzeImage = async () => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_VISION_API_KEY') {
      showToast('Vui lòng cấu hình Google Vision API Key', 'warning');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // In a real app, this would call the actual API
      // For demo purposes, we'll simulate the response
      let result;
      
      if (process.env.NODE_ENV === 'production') {
        result = await analyzeImageWithVision(imageUrl, apiKey);
      } else {
        // Simulate API response for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = simulateVisionApiResponse();
      }
      
      // Process and combine tags from different sources
      const labelTags = result.labels.map((label: any) => ({
        name: label.description,
        score: label.score,
        source: 'label' as const
      }));
      
      const webTags = result.webEntities.map((entity: any) => ({
        name: entity.description,
        score: entity.score,
        source: 'web' as const
      }));
      
      const objectTags = result.objects.map((object: any) => ({
        name: object.name,
        score: object.score,
        source: 'object' as const
      }));
      
      // Combine all tags and remove duplicates
      const allTags = [...labelTags, ...webTags, ...objectTags];
      const uniqueTags = removeDuplicateTags(allTags);
      
      // Sort by score (highest first)
      const sortedTags = uniqueTags.sort((a, b) => b.score - a.score);
      
      setTags(sortedTags);
      
      // Pre-select top 5 tags
      const topTags = sortedTags.slice(0, 5).map(tag => tag.name);
      setSelectedTags(topTags);
      
      // Notify parent component
      if (onTagsGenerated) {
        onTagsGenerated(topTags);
      }
      
      showToast('Phân tích ảnh thành công!', 'success');
    } catch (error) {
      console.error('Error analyzing image:', error);
      showToast('Không thể phân tích ảnh', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Remove duplicate tags based on name (case insensitive)
  const removeDuplicateTags = (tags: Tag[]): Tag[] => {
    const uniqueTags: Tag[] = [];
    const tagNames = new Set<string>();
    
    for (const tag of tags) {
      const lowerName = tag.name.toLowerCase();
      if (!tagNames.has(lowerName)) {
        tagNames.add(lowerName);
        uniqueTags.push(tag);
      }
    }
    
    return uniqueTags;
  };
  
  // Toggle tag selection
  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
    
    // Notify parent component
    if (onTagsGenerated) {
      const updatedTags = selectedTags.includes(tagName)
        ? selectedTags.filter(tag => tag !== tagName)
        : [...selectedTags, tagName];
      
      onTagsGenerated(updatedTags);
    }
  };
  
  // Get tag color based on source
  const getTagColor = (source: 'label' | 'web' | 'object') => {
    switch (source) {
      case 'label': return 'bg-purple-100 text-purple-800';
      case 'web': return 'bg-blue-100 text-blue-800';
      case 'object': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Simulate Vision API response for development
  const simulateVisionApiResponse = () => {
    return {
      labels: [
        { description: 'Bóng đá', score: 0.96 },
        { description: 'Thể thao', score: 0.94 },
        { description: 'Sân vận động', score: 0.89 },
        { description: 'Cầu thủ', score: 0.87 },
        { description: 'Bóng', score: 0.85 }
      ],
      webEntities: [
        { description: 'World Cup', score: 0.92 },
        { description: 'Giải đấu', score: 0.88 },
        { description: 'Đội tuyển', score: 0.85 },
        { description: 'Ronaldo', score: 0.82 },
        { description: 'Messi', score: 0.80 }
      ],
      objects: [
        { name: 'Người', score: 0.95 },
        { name: 'Bóng', score: 0.93 },
        { name: 'Cỏ', score: 0.90 },
        { name: 'Áo đấu', score: 0.85 },
        { name: 'Giày', score: 0.82 }
      ]
    };
  };
  
  return (
    <AnimatedContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiTag className="text-purple-600 mr-2" />
          <h3 className="font-medium text-gray-800">Nhận diện nội dung</h3>
        </div>
        
        <Button 
          onClick={analyzeImage} 
          disabled={isAnalyzing}
          variant="outline" 
          size="sm"
          icon={<FiImage />}
        >
          {isAnalyzing ? 'Đang phân tích...' : 'Phân tích ảnh'}
        </Button>
      </div>
      
      {tags.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <button
                key={`${tag.name}-${index}`}
                className={`px-3 py-1 rounded-full text-sm ${getTagColor(tag.source)} ${
                  selectedTags.includes(tag.name) ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => toggleTag(tag.name)}
              >
                {tag.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-100 mr-1"></div>
              <span>Nhãn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
              <span>Web</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
              <span>Đối tượng</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mb-2"></div>
              <p>Đang phân tích ảnh...</p>
            </div>
          ) : (
            <p>Nhấn "Phân tích ảnh" để nhận diện nội dung</p>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Sử dụng Google Vision API để nhận diện nội dung và gắn thẻ tự động cho ảnh.
      </div>
    </AnimatedContainer>
  );
};

export default AIImageAnalyzer;
