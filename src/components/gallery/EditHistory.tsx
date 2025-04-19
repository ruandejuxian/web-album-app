import React, { useState, useEffect } from 'react';
import { FiClock, FiRotateCcw, FiSave, FiList, FiEye } from 'react-icons/fi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { v4 as uuidv4 } from 'uuid';
import AnimatedContainer from '../ui/AnimatedContainer';

interface EditVersion {
  id: string;
  timestamp: Date;
  description: string;
  imageUrl: string;
}

interface EditHistoryProps {
  imageId: string;
  currentImageUrl: string;
  onRestoreVersion: (version: EditVersion) => void;
}

const EditHistory: React.FC<EditHistoryProps> = ({
  imageId,
  currentImageUrl,
  onRestoreVersion
}) => {
  const [editHistory, setEditHistory] = useState<EditVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const { showToast } = useToast();
  
  // Load edit history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem(`editHistory_${imageId}`);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Convert string timestamps to Date objects
        const formattedHistory = parsedHistory.map((version: any) => ({
          ...version,
          timestamp: new Date(version.timestamp)
        }));
        setEditHistory(formattedHistory);
      } catch (error) {
        console.error('Error parsing edit history:', error);
      }
    }
  }, [imageId]);
  
  // Save edit history to localStorage
  useEffect(() => {
    if (editHistory.length > 0) {
      localStorage.setItem(`editHistory_${imageId}`, JSON.stringify(editHistory));
    }
  }, [editHistory, imageId]);
  
  // Save current version to history
  const saveCurrentVersion = async () => {
    if (!editDescription.trim()) {
      showToast('Vui lòng nhập mô tả cho phiên bản này', 'warning');
      return;
    }
    
    try {
      // Generate a unique ID for this version
      const versionId = uuidv4();
      
      // In a real app, we would save the image to a server or cloud storage
      // For this implementation, we'll use the current image URL
      
      const newVersion: EditVersion = {
        id: versionId,
        timestamp: new Date(),
        description: editDescription.trim(),
        imageUrl: currentImageUrl
      };
      
      // Add to history (newest first)
      setEditHistory([newVersion, ...editHistory]);
      setEditDescription('');
      
      // Limit history to 10 versions to save space
      if (editHistory.length >= 10) {
        const trimmedHistory = editHistory.slice(0, 9);
        setEditHistory([newVersion, ...trimmedHistory]);
      }
      
      showToast('Đã lưu phiên bản hiện tại vào lịch sử', 'success');
      
      // Track edit history in analytics (in a real app)
      console.log('Edit version saved:', {
        imageId,
        versionId,
        timestamp: new Date().toISOString(),
        description: editDescription.trim()
      });
    } catch (error) {
      console.error('Error saving edit version:', error);
      showToast('Không thể lưu phiên bản', 'error');
    }
  };
  
  // Restore a previous version
  const restoreVersion = (version: EditVersion) => {
    try {
      // In a real app, we might need to fetch the image from storage
      onRestoreVersion(version);
      setSelectedVersion(null);
      
      // Add an entry to history about the restoration
      const restorationNote = `Đã khôi phục từ phiên bản "${version.description}" (${formatTimestamp(version.timestamp)})`;
      
      // Save current state before restoring (optional)
      if (editDescription.trim()) {
        const currentVersion: EditVersion = {
          id: uuidv4(),
          timestamp: new Date(),
          description: editDescription.trim(),
          imageUrl: currentImageUrl
        };
        setEditHistory([currentVersion, ...editHistory]);
      }
      
      setEditDescription(restorationNote);
      showToast('Đã khôi phục phiên bản trước đó', 'success');
    } catch (error) {
      console.error('Error restoring version:', error);
      showToast('Không thể khôi phục phiên bản', 'error');
    }
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Compare images to detect changes (in a real app, this would be more sophisticated)
  const hasChanges = () => {
    if (editHistory.length === 0) return true;
    return currentImageUrl !== editHistory[0].imageUrl;
  };
  
  return (
    <AnimatedContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiClock className="text-purple-600 mr-2" />
          <h3 className="font-medium text-gray-800">Lịch sử chỉnh sửa</h3>
        </div>
        
        <Button 
          onClick={() => setShowHistory(!showHistory)} 
          variant="outline" 
          size="sm"
          icon={showHistory ? <FiEye /> : <FiList />}
        >
          {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử'}
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Mô tả phiên bản hiện tại..."
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
        <Button 
          onClick={saveCurrentVersion} 
          icon={<FiSave />}
          disabled={!hasChanges() || !editDescription.trim()}
        >
          Lưu phiên bản
        </Button>
      </div>
      
      {!hasChanges() && editHistory.length > 0 && (
        <p className="text-sm text-yellow-600">
          Không có thay đổi so với phiên bản mới nhất.
        </p>
      )}
      
      {showHistory && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Các phiên bản đã lưu:</h4>
          
          {editHistory.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có phiên bản nào được lưu.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {editHistory.map((version) => (
                <div 
                  key={version.id}
                  className={`p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors ${
                    selectedVersion === version.id ? 'bg-purple-50 border-purple-300' : 'bg-white'
                  }`}
                  onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">{version.description}</span>
                    <span className="text-xs text-gray-500">{formatTimestamp(version.timestamp)}</span>
                  </div>
                  
                  {selectedVersion === version.id && (
                    <div className="mt-2 space-y-3">
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={version.imageUrl} 
                          alt={`Phiên bản ${formatTimestamp(version.timestamp)}`} 
                          className="w-full h-auto"
                        />
                      </div>
                      
                      <Button 
                        onClick={() => restoreVersion(version)} 
                        fullWidth
                        icon={<FiRotateCcw />}
                      >
                        Khôi phục phiên bản này
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default EditHistory;
