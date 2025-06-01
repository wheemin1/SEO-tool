
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { measureTextWidth } from '@/utils/textMeasurement';
import { highlightKeywords } from '@/utils/keywordHighlighter';

interface SERPResultDisplayProps {
  title: string;
  description: string;
  url: string;
  viewMode: 'desktop' | 'mobile';
  titlePixelLimit: number;
  descriptionPixelLimit: number;
  keywords?: string[];
}

const SERPResultDisplay: React.FC<SERPResultDisplayProps> = ({
  title,
  description,
  url,
  viewMode,
  titlePixelLimit,
  descriptionPixelLimit,
  keywords = [],
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [truncatedTitle, setTruncatedTitle] = useState(title);
  const [truncatedDescription, setTruncatedDescription] = useState(description);

  useEffect(() => {
    if (canvasRef.current) {
      // Truncate title if it exceeds pixel limit
      const titleFont = viewMode === 'desktop' ? '20px Arial' : '18px Arial';
      let truncTitle = title;
      let titleWidth = measureTextWidth(truncTitle, titleFont, canvasRef.current);
      
      if (titleWidth > titlePixelLimit) {
        while (titleWidth > titlePixelLimit && truncTitle.length > 3) {
          truncTitle = truncTitle.slice(0, -1);
          titleWidth = measureTextWidth(truncTitle + '...', titleFont, canvasRef.current);
        }
        truncTitle += '...';
      }
      setTruncatedTitle(truncTitle);

      // Truncate description if it exceeds pixel limit
      const descFont = viewMode === 'desktop' ? '14px Arial' : '13px Arial';
      let truncDesc = description;
      let descWidth = measureTextWidth(truncDesc, descFont, canvasRef.current);
      
      if (descWidth > descriptionPixelLimit) {
        while (descWidth > descriptionPixelLimit && truncDesc.length > 3) {
          truncDesc = truncDesc.slice(0, -1);
          descWidth = measureTextWidth(truncDesc + '...', descFont, canvasRef.current);
        }
        truncDesc += '...';
      }
      setTruncatedDescription(truncDesc);
    }
  }, [title, description, viewMode, titlePixelLimit, descriptionPixelLimit]);

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url.replace(/^https?:\/\//, '');
    }
  };

  const containerClass = viewMode === 'desktop' 
    ? 'max-w-lg' 
    : 'max-w-sm';

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600 ${containerClass}`}>
      {/* Google Search Result Simulation */}
      <div className="space-y-1">
        {/* URL with favicon */}
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-gray-800 dark:text-gray-200">{formatUrl(url)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-normal leading-tight ${
            viewMode === 'desktop' ? 'text-xl' : 'text-lg'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {highlightKeywords(truncatedTitle, keywords)}
        </h3>

        {/* Description */}
        <p 
          className={`text-gray-600 dark:text-gray-300 leading-normal ${
            viewMode === 'desktop' ? 'text-sm' : 'text-xs'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {highlightKeywords(truncatedDescription, keywords)}
        </p>
      </div>

      {/* Cutoff Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>{t('preview.titleCutoff')}</span>
            <span className={truncatedTitle.endsWith('...') ? 'text-red-500 dark:text-red-400 font-medium' : 'text-green-500 dark:text-green-400'}>
              {truncatedTitle.endsWith('...') ? t('preview.truncated') : t('preview.full')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('preview.descriptionCutoff')}</span>
            <span className={truncatedDescription.endsWith('...') ? 'text-red-500 dark:text-red-400 font-medium' : 'text-green-500 dark:text-green-400'}>
              {truncatedDescription.endsWith('...') ? t('preview.truncated') : t('preview.full')}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden canvas for text measurement */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default SERPResultDisplay;
