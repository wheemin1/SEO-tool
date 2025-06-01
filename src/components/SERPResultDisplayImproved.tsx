import React, { useRef, useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Globe } from 'lucide-react';
import { truncateTextToPixelWidthOptimized } from '@/utils/textMeasurement';
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

const SERPResultDisplay = memo<SERPResultDisplayProps>(({
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
      const titleFont = viewMode === 'desktop' ? '20px Arial' : '18px Arial';
      const descFont = viewMode === 'desktop' ? '14px Arial' : '13px Arial';

      const newTruncatedTitle = truncateTextToPixelWidthOptimized(
        title,
        titleFont,
        titlePixelLimit,
        canvasRef.current
      );

      const newTruncatedDescription = truncateTextToPixelWidthOptimized(
        description,
        descFont,
        descriptionPixelLimit,
        canvasRef.current
      );

      setTruncatedTitle(newTruncatedTitle);
      setTruncatedDescription(newTruncatedDescription);
    }
  }, [title, description, viewMode, titlePixelLimit, descriptionPixelLimit]);

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return {
        domain: urlObj.hostname,
        path: urlObj.pathname,
        full: `${urlObj.hostname}${urlObj.pathname}`,
      };
    } catch {
      const cleanUrl = url.replace(/^https?:\/\//, '');
      const [domain, ...pathParts] = cleanUrl.split('/');
      return {
        domain: domain || cleanUrl,
        path: pathParts.length > 0 ? '/' + pathParts.join('/') : '',
        full: cleanUrl,
      };
    }
  };

  const urlInfo = formatUrl(url);
  const containerClass = viewMode === 'desktop' ? 'max-w-lg' : 'max-w-sm';

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600 ${containerClass}`}>
      {/* Google Search Result Simulation */}
      <article className="space-y-1" role="article" aria-labelledby="serp-title">
        {/* URL with favicon */}
        <div className="flex items-center space-x-2 mb-1">
          <div 
            className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center justify-center"
            aria-label="Website favicon"
          >
            <Globe size={10} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-gray-800 dark:text-gray-200">
              {urlInfo.domain}
            </span>
            {urlInfo.path && (
              <span className="text-gray-500 dark:text-gray-500">
                {urlInfo.path}
              </span>
            )}
          </div>
          <ExternalLink size={12} className="text-gray-400 dark:text-gray-500" />
        </div>

        {/* Title */}
        <h3 
          id="serp-title"
          className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-normal leading-tight transition-colors ${
            viewMode === 'desktop' ? 'text-xl' : 'text-lg'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
          role="heading"
          aria-level={3}
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

        {/* Additional SERP features simulation */}
        {keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Cutoff Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>{t('preview.titleCutoff')}</span>
            <span className={`font-medium ${
              truncatedTitle.endsWith('...') 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-green-500 dark:text-green-400'
            }`}>
              {truncatedTitle.endsWith('...') ? t('preview.truncated') : t('preview.full')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>{t('preview.descriptionCutoff')}</span>
            <span className={`font-medium ${
              truncatedDescription.endsWith('...') 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-green-500 dark:text-green-400'
            }`}>
              {truncatedDescription.endsWith('...') ? t('preview.truncated') : t('preview.full')}
            </span>
          </div>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">CTR Score:</span>
              <span className={`ml-1 ${
                keywords.length > 0 && title.toLowerCase().includes(keywords[0]?.toLowerCase()) 
                  ? 'text-green-500' 
                  : 'text-yellow-500'
              }`}>
                {keywords.length > 0 && title.toLowerCase().includes(keywords[0]?.toLowerCase()) 
                  ? 'Good' 
                  : 'Fair'}
              </span>
            </div>
            <div>
              <span className="font-medium">Length:</span>
              <span className={`ml-1 ${
                !truncatedTitle.endsWith('...') && !truncatedDescription.endsWith('...') 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {!truncatedTitle.endsWith('...') && !truncatedDescription.endsWith('...') 
                  ? 'Optimal' 
                  : 'Too Long'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for text measurement */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
    </div>
  );
});

SERPResultDisplay.displayName = 'SERPResultDisplay';

export default SERPResultDisplay;
