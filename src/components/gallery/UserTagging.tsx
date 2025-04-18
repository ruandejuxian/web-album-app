import React, { useState, useEffect } from 'react';
import { FiTag, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface UserTaggingProps {
  imageId: string;
  initialTags?: string[];
  onTagsUpdate: (tags: string[]) => void;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const UserTagging: React.FC<UserTaggingProps> = ({
  imageId,
  initialTags = [],
  onTagsUpdate
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [isTagging, setIsTagging] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { showToast } = useToast();

  // Fetch all users (in a real app, this would come from an API)
  useEffect(() => {
    // Simulating API call to get users
    const mockUsers: User[] = [
      { id: 'user1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user3', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 'user4', name: 'Phạm Thị D', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: 'user5', name: 'Hoàng Văn E', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: 'user6', name: 'Ngô Thị F', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: 'user7', name: 'Đỗ Văn G', avatar: 'https://i.pravatar.cc/150?img=7' },
      { id: 'user8', name: 'Vũ Thị H', avatar: 'https://i.pravatar.cc/150?img=8' },
    ];
    
    setAllUsers(mockUsers);
  }, []);

  // Filter users based on input
  useEffect(() => {
    if (inputValue.trim() && isTagging) {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(user.id)
      );
      setSuggestedUsers(filtered);
    } else {
      setSuggestedUsers([]);
    }
  }, [inputValue, isTagging, allUsers, tags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsTagging(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsTagging(false);
    }, 200);
  };

  const addTag = (userId: string) => {
    if (!tags.includes(userId)) {
      const newTags = [...tags, userId];
      setTags(newTags);
      onTagsUpdate(newTags);
      setInputValue('');
      
      // In a real app, you would save this to a database
      // For now, we'll just show a toast
      const user = allUsers.find(u => u.id === userId);
      showToast(`Đã gắn thẻ ${user?.name}`, 'success');
      
      // Notify the tagged user (in a real app)
      console.log(`Notification sent to user ${userId} for image ${imageId}`);
    }
  };

  const removeTag = (userId: string) => {
    const newTags = tags.filter(id => id !== userId);
    setTags(newTags);
    onTagsUpdate(newTags);
    
    // In a real app, you would update this in a database
    const user = allUsers.find(u => u.id === userId);
    showToast(`Đã xóa thẻ ${user?.name}`, 'info');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestedUsers.length > 0) {
      e.preventDefault();
      addTag(suggestedUsers[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <FiTag className="text-purple-600 mr-2" />
        <h3 className="font-medium text-gray-800">Gắn thẻ người dùng</h3>
      </div>
      
      <div className="relative">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Nhập tên người dùng để gắn thẻ..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        
        {isTagging && suggestedUsers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center p-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => addTag(user.id)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {isTagging && inputValue && suggestedUsers.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <div className="flex items-center text-gray-500">
              <FiAlertCircle className="mr-2" />
              <span>Không tìm thấy người dùng phù hợp</span>
            </div>
          </div>
        )}
      </div>
      
      {tags.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Người được gắn thẻ:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tagId => {
              const user = allUsers.find(u => u.id === tagId);
              return user ? (
                <div
                  key={tagId}
                  className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full mr-1" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center mr-1 text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm">{user.name}</span>
                  <button
                    onClick={() => removeTag(tagId)}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                    aria-label={`Remove tag ${user.name}`}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        Người được gắn thẻ sẽ nhận được thông báo về ảnh này.
      </div>
    </div>
  );
};

export default UserTagging;
