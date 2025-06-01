
import React, { useRef, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SERPResultDisplay from './SERPResultDisplay';
import MetaTagGenerator from './MetaTagGenerator';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { MetricsDisplay } from './StatusIndicator';
import { useSERPState } from '@/hooks/useSERPState';

const SERPPreview = memo(() => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    state,
    metrics,
    limits,
    keywordArray,
    updateTitle,
    updateDescription,
    updateUrl,
    updateKeywords,
    updateViewMode,
    calculateMetrics,
  } = useSERPState();

  // Calculate metrics when canvas is available or dependencies change
  useEffect(() => {
    calculateMetrics(canvasRef.current);
  }, [calculateMetrics]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <div className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('app.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('app.subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex justify-center space-x-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => setViewMode('desktop')}
                className="flex items-center space-x-2 dark:border-gray-600"
                aria-label={t('viewMode.desktop')}
              >
                <Monitor size={16} />
                <span>{t('viewMode.desktop')}</span>
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => setViewMode('mobile')}
                className="flex items-center space-x-2 dark:border-gray-600"
                aria-label={t('viewMode.mobile')}
              >
                <Smartphone size={16} />
                <span>{t('viewMode.mobile')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t('form.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium dark:text-gray-200">
                    {t('form.pageTitle')}
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('form.pageTitlePlaceholder')}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="title-metrics"
                  />
                  <div id="title-metrics" className={`text-xs flex justify-between ${getStatusColor(getTitleStatus())}`}>
                    <span>{t('metrics.characters')}: {title.length}/{TITLE_CHAR_LIMIT}</span>
                    <span>{t('metrics.pixels')}: {Math.round(titlePixelWidth)}/{TITLE_PIXEL_LIMIT}px</span>
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium dark:text-gray-200">
                    {t('form.metaDescription')}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('form.metaDescriptionPlaceholder')}
                    className="w-full h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="description-metrics"
                  />
                  <div id="description-metrics" className={`text-xs flex justify-between ${getStatusColor(getDescriptionStatus())}`}>
                    <span>{t('metrics.characters')}: {description.length}/{DESCRIPTION_CHAR_LIMIT}</span>
                    <span>{t('metrics.pixels')}: {Math.round(descriptionPixelWidth)}/{DESCRIPTION_PIXEL_LIMIT}px</span>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium dark:text-gray-200">
                    {t('form.pageUrl')}
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t('form.pageUrlPlaceholder')}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-medium dark:text-gray-200">
                    {t('form.keywords')}
                  </Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={t('form.keywordsPlaceholder')}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="keywords-helper"
                  />
                  <p id="keywords-helper" className="text-xs text-gray-500 dark:text-gray-400">
                    {t('form.keywordsHelper')}
                  </p>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-800">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('tips.title')}</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• {t('tips.titleLimit', { limit: TITLE_PIXEL_LIMIT })}</li>
                    <li>• {t('tips.descriptionLimit', { limit: DESCRIPTION_PIXEL_LIMIT })}</li>
                    <li>• {t('tips.includeKeyword')}</li>
                    <li>• {t('tips.compelling')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Meta Tag Generator */}
            <MetaTagGenerator title={title} description={description} />
          </div>

          {/* SERP Preview */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                {viewMode === 'desktop' ? <Monitor size={20} /> : <Smartphone size={20} />}
                <span>{t('preview.title', { mode: t(`viewMode.${viewMode}`) })}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SERPResultDisplay
                title={title}
                description={description}
                url={url}
                viewMode={viewMode}
                titlePixelLimit={TITLE_PIXEL_LIMIT}
                descriptionPixelLimit={DESCRIPTION_PIXEL_LIMIT}
                keywords={keywordArray}
              />
            </CardContent>
          </Card>
        </div>

        {/* Hidden canvas for text measurement */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default SERPPreview;
