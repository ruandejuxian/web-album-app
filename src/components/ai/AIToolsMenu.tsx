import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import AIImageEditor from './AIImageEditor';
import AIImageAnalyzer, { ImageAnalysisResult } from './AIImageAnalyzer';
import AIImageEnhancer from './AIImageEnhancer';
import { useToast } from '../context/ToastContext';
import { FiEdit2, FiTag, FiZap } from 'react-icons/fi';

interface AIToolsMenuProps {
  imageUrl: string;
  onApplyChanges: (updatedImageUrl: string, analysisData?: ImageAnalysisResult) => void;
}

type AITool = 'editor' | 'analyzer' | 'enhancer';

const AIToolsMenu: React.FC<AIToolsMenuProps> = ({
  imageUrl,
  onApplyChanges
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<AITool | null>(null);
  const { showToast } = useToast();
  
  const openTool = (tool: AITool) => {
    setActiveTool(tool);
    setIsMenuOpen(false);
  };
  
  const closeTool = () => {
    setActiveTool(null);
  };
  
  const handleEditorSave = (editedImageUrl: string) => {
    onApplyChanges(editedImageUrl);
    closeTool();
    showToast('Đã lưu chỉnh sửa ảnh thành công', 'success');
  };
  
  const handleEnhancerSave = (enhancedImageUrl: string) => {
    onApplyChanges(enhancedImageUrl);
    closeTool();
    showToast('Đã nâng cao chất lượng ảnh thành công', 'success');
  };
  
  const handleAnalyzerSave = (analysisResult: ImageAnalysisResult) => {
    onApplyChanges(imageUrl, analysisResult);
    closeTool();
    showToast('Đã áp dụng kết quả phân tích thành công', 'success');
  };
  
  const tools = [
    { id: 'editor', name: 'Chỉnh sửa ảnh', icon: <FiEdit2 />, description: 'Điều chỉnh màu sắc, độ sáng, bộ lọc' },
    { id: 'analyzer', name: 'Phân tích ảnh', icon: <FiTag />, description: 'Tự động tạo tags, mô tả' },
    { id: 'enhancer', name: 'Nâng cao chất lượng', icon: <FiZap />, description: 'Cải thiện chất lượng ảnh với AI' }
  ];
  
  return (
    <>
      <div className="relative">
        <Button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="primary"
          icon={<FiEdit2 />}
        >
          Công cụ AI
        </Button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 overflow-hidden"
            >
              <div className="p-2">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    className="w-full p-3 rounded-lg flex items-center text-left hover:bg-gray-100 transition-colors"
                    onClick={() => openTool(tool.id as AITool)}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xl p-2 bg-purple-100 text-purple-600 rounded-full mr-3">
                      {tool.icon}
                    </span>
                    <div>
                      <div className="font-medium text-gray-800">{tool.name}</div>
                      <div className="text-xs text-gray-500">{tool.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* AI Tools Modals */}
      <Modal
        isOpen={activeTool === 'editor'}
        onClose={closeTool}
        title="Chỉnh sửa ảnh với AI"
        maxWidth="2xl"
      >
        <AIImageEditor
          imageUrl={imageUrl}
          onSave={handleEditorSave}
          onCancel={closeTool}
        />
      </Modal>
      
      <Modal
        isOpen={activeTool === 'analyzer'}
        onClose={closeTool}
        title="Phân tích ảnh với AI"
        maxWidth="2xl"
      >
        <AIImageAnalyzer
          imageUrl={imageUrl}
          onSave={handleAnalyzerSave}
          onCancel={closeTool}
        />
      </Modal>
      
      <Modal
        isOpen={activeTool === 'enhancer'}
        onClose={closeTool}
        title="Nâng cao chất lượng ảnh với AI"
        maxWidth="2xl"
      >
        <AIImageEnhancer
          imageUrl={imageUrl}
          onSave={handleEnhancerSave}
          onCancel={closeTool}
        />
      </Modal>
    </>
  );
};

export default AIToolsMenu;
