import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  children, 
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'error':
        return <AlertCircle size={16} className="text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getAriaLabel = () => {
    switch (status) {
      case 'error':
        return 'Error: Length or width exceeds recommended limits';
      case 'warning':
        return 'Warning: Approaching recommended limits';
      default:
        return 'Good: Within recommended limits';
    }
  };

  return (
    <div 
      className={`flex items-center space-x-2 ${getStatusColor()} ${className}`}
      aria-label={getAriaLabel()}
      role="status"
    >
      {getStatusIcon()}
      <span>{children}</span>
    </div>
  );
};

interface MetricsDisplayProps {
  current: number;
  limit: number;
  label: string;
  pixels?: number;
  pixelLimit?: number;
  status: 'good' | 'warning' | 'error';
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  current,
  limit,
  label,
  pixels,
  pixelLimit,
  status,
}) => {
  return (
    <div className="space-y-1">
      <StatusIndicator status={status} className="text-xs">
        <div className="flex justify-between w-full">
          <span>{label}: {current}/{limit}</span>
          {pixels !== undefined && pixelLimit !== undefined && (
            <span>Pixels: {Math.round(pixels)}/{pixelLimit}px</span>
          )}
        </div>
      </StatusIndicator>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${
            status === 'error' 
              ? 'bg-red-500' 
              : status === 'warning' 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
          }`}
          style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-label={`${label} usage: ${current} of ${limit}`}
        />
      </div>
    </div>
  );
};
