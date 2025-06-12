import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
  visible?: boolean;
}

export function ToastNotification({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onDismiss,
  visible = false 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'success':
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      case 'success':
      default:
        return 'fas fa-check-circle';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 transform transition-transform duration-300 max-w-sm',
        isVisible ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className={cn(
        'px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3',
        getTypeStyles()
      )}>
        <i className={cn(getIcon(), 'text-xl')} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={handleDismiss}
          className="ml-4 p-1 hover:bg-black/20 rounded transition-colors"
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
  );
}
