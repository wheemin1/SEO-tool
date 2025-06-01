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
import SEOAnalysisPanel from './SEOAnalysisPanel';
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

        {/* View Mode Toggle */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex justify-center space-x-2" role="tablist" aria-label="View mode selection">
              <Button
                variant={state.viewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => updateViewMode('desktop')}
                className="flex items-center space-x-2 dark:border-gray-600"
                aria-label={t('viewMode.desktop')}
                role="tab"
                aria-selected={state.viewMode === 'desktop'}
              >
                <Monitor size={16} />
                <span>{t('viewMode.desktop')}</span>
              </Button>
              <Button
                variant={state.viewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => updateViewMode('mobile')}
                className="flex items-center space-x-2 dark:border-gray-600"
                aria-label={t('viewMode.mobile')}
                role="tab"
                aria-selected={state.viewMode === 'mobile'}
              >
                <Smartphone size={16} />
                <span>{t('viewMode.mobile')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <section className="space-y-6" aria-label="SEO content editor">
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
                    value={state.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    placeholder={t('form.pageTitlePlaceholder')}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="title-metrics"
                    maxLength={limits.TITLE_CHAR_LIMIT * 1.5} // Allow some overflow for user awareness
                  />
                  <div id="title-metrics">
                    <MetricsDisplay
                      current={state.title.length}
                      limit={limits.TITLE_CHAR_LIMIT}
                      label={t('metrics.characters')}
                      pixels={metrics.titlePixelWidth}
                      pixelLimit={limits.TITLE_PIXEL_LIMIT}
                      status={metrics.titleStatus}
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium dark:text-gray-200">
                    {t('form.metaDescription')}
                  </Label>
                  <Textarea
                    id="description"
                    value={state.description}
                    onChange={(e) => updateDescription(e.target.value)}
                    placeholder={t('form.metaDescriptionPlaceholder')}
                    className="w-full h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="description-metrics"
                    maxLength={limits.DESCRIPTION_CHAR_LIMIT * 1.5}
                  />
                  <div id="description-metrics">
                    <MetricsDisplay
                      current={state.description.length}
                      limit={limits.DESCRIPTION_CHAR_LIMIT}
                      label={t('metrics.characters')}
                      pixels={metrics.descriptionPixelWidth}
                      pixelLimit={limits.DESCRIPTION_PIXEL_LIMIT}
                      status={metrics.descriptionStatus}
                    />
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium dark:text-gray-200">
                    {t('form.pageUrl')}
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    value={state.url}
                    onChange={(e) => updateUrl(e.target.value)}
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
                    value={state.keywords}
                    onChange={(e) => updateKeywords(e.target.value)}
                    placeholder={t('form.keywordsPlaceholder')}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    aria-describedby="keywords-helper"
                  />
                  <p id="keywords-helper" className="text-xs text-gray-500 dark:text-gray-400">
                    {t('form.keywordsHelper')}
                  </p>
                  {keywordArray.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {keywordArray.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-800">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {t('tips.title')}
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• {t('tips.titleLimit', { limit: limits.TITLE_PIXEL_LIMIT })}</li>
                    <li>• {t('tips.descriptionLimit', { limit: limits.DESCRIPTION_PIXEL_LIMIT })}</li>
                    <li>• {t('tips.includeKeyword')}</li>
                    <li>• {t('tips.compelling')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>            {/* Meta Tag Generator */}
            <MetaTagGenerator title={state.title} description={state.description} />

            {/* SEO Analysis Panel */}
            <SEOAnalysisPanel
              title={state.title}
              description={state.description}
              url={state.url}
              keywords={keywordArray}
            />
          </section>

          {/* SERP Preview */}
          <section aria-label="Search result preview">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-white">
                  {state.viewMode === 'desktop' ? <Monitor size={20} /> : <Smartphone size={20} />}
                  <span>{t('preview.title', { mode: t(`viewMode.${state.viewMode}`) })}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SERPResultDisplay
                  title={state.title}
                  description={state.description}
                  url={state.url}
                  viewMode={state.viewMode}
                  titlePixelLimit={limits.TITLE_PIXEL_LIMIT}
                  descriptionPixelLimit={limits.DESCRIPTION_PIXEL_LIMIT}
                  keywords={keywordArray}
                />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Hidden canvas for text measurement */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }} 
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

SERPPreview.displayName = 'SERPPreview';

export default SERPPreview;
