import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import AnimatedContainer from '../ui/AnimatedContainer';

interface ApprovalNotificationProps {
  userId: string;
  imageId: string;
  initialStatus?: 'pending' | 'approved' | 'rejected';
  onStatusChange?: (status: 'pending' | 'approved' | 'rejected') => void;
}

const ApprovalNotification: React.FC<ApprovalNotificationProps> = ({
  userId,
  imageId,
  initialStatus = 'pending',
  onStatusChange
}) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [submissionDate, setSubmissionDate] = useState<Date>(new Date());
  const [responseDate, setResponseDate] = useState<Date | null>(null);
  const { showToast } = useToast();
  
  // Load status from localStorage or Google Sheets in a real app
  useEffect(() => {
    // Simulate loading from storage
    const storedStatus = localStorage.getItem(`approval_${imageId}`);
    if (storedStatus) {
      setStatus(storedStatus as 'pending' | 'approved' | 'rejected');
    }
    
    // Simulate loading dates
    const storedSubmissionDate = localStorage.getItem(`submission_date_${imageId}`);
    if (storedSubmissionDate) {
      setSubmissionDate(new Date(storedSubmissionDate));
    }
    
    const storedResponseDate = localStorage.getItem(`response_date_${imageId}`);
    if (storedResponseDate) {
      setResponseDate(new Date(storedResponseDate));
    }
  }, [imageId]);
  
  // Update Google Sheets with approval status
  const updateApprovalStatus = async (newStatus: 'pending' | 'approved' | 'rejected') => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would call the Google Sheets API
      // For now, we'll simulate with localStorage
      localStorage.setItem(`approval_${imageId}`, newStatus);
      
      // Update response date if status is changing from pending
      if (status === 'pending' && newStatus !== 'pending') {
        const now = new Date();
        localStorage.setItem(`response_date_${imageId}`, now.toISOString());
        setResponseDate(now);
      }
      
      // Update state
      setStatus(newStatus);
      
      // Notify parent component
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      
      showToast(`Trạng thái ảnh đã được cập nhật thành ${getStatusText(newStatus)}`, 'success');
    } catch (error) {
      console.error('Error updating approval status:', error);
      showToast('Không thể cập nhật trạng thái ảnh', 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'Đang chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
    }
  };
  
  const getStatusIcon = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'approved': return <FiCheckCircle className="text-green-500" />;
      case 'rejected': return <FiXCircle className="text-red-500" />;
    }
  };
  
  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'approved': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <AnimatedContainer className="space-y-4">
      <div className="flex items-center">
        <FiInfo className="text-purple-600 mr-2" />
        <h3 className="font-medium text-gray-800">Thông báo duyệt</h3>
      </div>
      
      <div className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {getStatusIcon(status)}
            <span className="ml-2 font-medium">{getStatusText(status)}</span>
          </div>
          
          {status === 'pending' && (
            <div className="text-xs text-yellow-600">
              Ảnh của bạn đang được xem xét
            </div>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày gửi:</span>
            <span className="font-medium">{formatDate(submissionDate)}</span>
          </div>
          
          {responseDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày phản hồi:</span>
              <span className="font-medium">{formatDate(responseDate)}</span>
            </div>
          )}
          
          {status === 'rejected' && (
            <div className="mt-3 p-2 bg-red-100 rounded text-red-700 text-xs">
              <FiAlertTriangle className="inline-block mr-1" />
              Ảnh của bạn không được duyệt. Vui lòng kiểm tra lại nội dung và thử lại.
            </div>
          )}
        </div>
        
        {/* Admin controls - would be conditionally rendered based on user role in a real app */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quản trị viên: Cập nhật trạng thái</p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={status === 'approved' ? 'primary' : 'outline'}
              onClick={() => updateApprovalStatus('approved')}
              disabled={isUpdating || status === 'approved'}
              className="flex-1"
            >
              <FiCheckCircle className="mr-1" />
              Duyệt
            </Button>
            <Button
              size="sm"
              variant={status === 'rejected' ? 'primary' : 'outline'}
              onClick={() => updateApprovalStatus('rejected')}
              disabled={isUpdating || status === 'rejected'}
              className="flex-1"
            >
              <FiXCircle className="mr-1" />
              Từ chối
            </Button>
            {(status === 'approved' || status === 'rejected') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateApprovalStatus('pending')}
                disabled={isUpdating || status === 'pending'}
                className="flex-1"
              >
                <FiClock className="mr-1" />
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Ảnh được duyệt sẽ hiển thị công khai trong thư viện. Ảnh bị từ chối sẽ chỉ hiển thị riêng tư cho bạn.
      </div>
    </AnimatedContainer>
  );
};

export default ApprovalNotification;
