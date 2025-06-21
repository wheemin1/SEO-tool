import React from 'react';
import { cn } from '@/lib/utils';

interface HighlightBorderProps {
  children: React.ReactNode;
  isActive?: boolean;
  step?: number;
  className?: string;
}

export const HighlightBorder: React.FC<HighlightBorderProps> = ({ 
  children, 
  isActive = false, 
  step, 
  className 
}) => {
  return (
    <div className={cn(
      "relative",
      className
    )}>
      {/* 하이라이트 테두리 - 깜빡임 제거, 고정된 테두리만 */}
      {isActive && (
        <>
          <div className="absolute -inset-1 border-2 border-blue-500 rounded-lg pointer-events-none z-10" />
          {step && (
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-20">
              {step}
            </div>
          )}
        </>
      )}
      
      {/* 컨텐츠 */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  step: number;
  title: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  title,
  isActive = false,
  isCompleted = false,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
        isActive && "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-30",
        isCompleted && "bg-green-50 dark:bg-green-900/20",
        !isActive && !isCompleted && "hover:bg-gray-50 dark:hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
        isActive && "bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse",
        isCompleted && "bg-green-500 text-white",
        !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
      )}>
        {isCompleted ? '✓' : step}
      </div>
      <span className={cn(
        "text-sm font-medium",
        isActive && "text-blue-700 dark:text-blue-300",
        isCompleted && "text-green-700 dark:text-green-300",
        !isActive && !isCompleted && "text-gray-600 dark:text-gray-400"
      )}>
        {title}
      </span>
    </div>
  );
};

export default HighlightBorder;
