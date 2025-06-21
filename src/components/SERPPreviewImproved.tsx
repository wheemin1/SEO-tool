import React, { useRef, useEffect, memo, useState } from 'react';
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
import TemplateSelector from './TemplateSelector';
import { MetricsDisplay } from './StatusIndicator';
import { useSERPState } from '@/hooks/useSERPState';
import { SEOScoreDashboard } from './SEOScoreDashboard';
import OnboardingGuide from './OnboardingGuide';
import QuickStartGuide from './QuickStartGuide';
import { HighlightBorder, StepIndicator } from './HighlightBorder';

const SERPPreview = memo(() => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 온보딩 상태 관리
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [currentHighlightStep, setCurrentHighlightStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
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
  }, [calculateMetrics]);  // Handler for template selection
  const handleTemplateSelect = (template: {
    title: string;
    description: string;
    url: string;
    keywords: string;
  }) => {
    updateTitle(template.title);
    updateDescription(template.description);
    updateUrl(template.url);
    updateKeywords(template.keywords);
    
    // 템플릿 선택 시 2단계(SERP Preview)로 이동
    setCurrentHighlightStep(2);
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
  };

  // 온보딩 핸들러들
  const handleStartOnboarding = () => {
    setShowQuickStart(false);
    setShowOnboarding(true);
    setCurrentHighlightStep(1);
  };

  const handleQuickStart = () => {
    setShowQuickStart(false);
    setCurrentHighlightStep(1);
  };

  const handleOnboardingStepComplete = (step: number) => {
    setCurrentHighlightStep(step);
    if (!completedSteps.includes(step - 1)) {
      setCompletedSteps([...completedSteps, step - 1]);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setCurrentHighlightStep(null);
  };
  // 입력 필드 변경 감지
  useEffect(() => {
    if (state.title || state.description || state.url) {
      if (currentHighlightStep === 2) {
        // 입력이 완료되면 3단계(SEO 분석)로 자동 이동
        setTimeout(() => {
          setCurrentHighlightStep(3);
        }, 1500); // 1.5초 후 이동
      }
      if (!completedSteps.includes(2)) {
        setCompletedSteps([...completedSteps, 2]);
      }
    }
  }, [state.title, state.description, state.url, currentHighlightStep, completedSteps]);
  return (    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 max-w-7xl">        {/* Header - Enhanced with onboarding */}
        <header className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <div className="group relative">
              <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">
                ?
              </div>              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {t('onboarding.helpTooltip')}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-3">
            {t('app.subtitle')}
          </p>
            {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-3 mb-4" key={`onboarding-buttons-${i18n.language}`}>            <Button
              onClick={() => {
                updateTitle(t('sampleData.title'));
                updateDescription(t('sampleData.description'));
                updateUrl(t('sampleData.url'));
                updateKeywords(t('sampleData.keywords'));
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              ✨ {t('onboarding.sampleData')}
            </Button>
            <Button
              onClick={() => {
                updateTitle('');
                updateDescription('');
                updateUrl('');
                updateKeywords('');
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              🗑️ {t('onboarding.reset')}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div></div> {/* Spacer */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>        </header>

        {/* Device Preview Mode Toggle - Compact */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border dark:border-gray-700">
            <Button
              variant={state.viewMode === 'desktop' ? 'default' : 'ghost'}
              onClick={() => updateViewMode('desktop')}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm"
              aria-label={t('viewMode.desktop')}
            >
              <Monitor size={14} />
              <span>{t('viewMode.desktop')}</span>
            </Button>
            <Button
              variant={state.viewMode === 'mobile' ? 'default' : 'ghost'}
              onClick={() => updateViewMode('mobile')}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm"
              aria-label={t('viewMode.mobile')}
            >
              <Smartphone size={14} />
              <span>{t('viewMode.mobile')}</span>
            </Button>
          </div>
        </div>        {/* Quick Start Guide */}
        {showQuickStart && (
          <QuickStartGuide
            onStartGuide={handleStartOnboarding}
            onQuickStart={handleQuickStart}
          />
        )}

        {/* SEO Score Dashboard */}
        <SEOScoreDashboard
          key={`seo-dashboard-${t('app.title')}`}
          title={state.title}
          description={state.description}
          url={state.url}
          keywords={keywordArray}
        />        {/* Main Grid Layout - 3-column optimized layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">          {/* Left Column - Template Selector Only (3/12 = 25%) */}          <div className="xl:col-span-3 space-y-4">
            <HighlightBorder 
              isActive={currentHighlightStep === 1} 
              step={1}
              className="template-selector"
            >
              <TemplateSelector onSelectTemplate={handleTemplateSelect} />
            </HighlightBorder>
          </div>

          {/* Middle Column - SERP Preview + Input Form (5/12 = 41.7%) */}          <div className="xl:col-span-5">
            <HighlightBorder 
              isActive={currentHighlightStep === 2} 
              step={2}
              className="serp-preview"
            >
              <section aria-label="Search result preview">
                <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    {state.viewMode === 'desktop' ? <Monitor size={20} /> : <Smartphone size={20} />}
                    <span>{t('preview.title', { mode: t(`viewMode.${state.viewMode}`) })}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* SERP Result Display */}
                  <SERPResultDisplay
                    title={state.title}
                    description={state.description}
                    url={state.url}
                    viewMode={state.viewMode}
                    titlePixelLimit={limits.TITLE_PIXEL_LIMIT}
                    descriptionPixelLimit={limits.DESCRIPTION_PIXEL_LIMIT}
                    keywords={keywordArray}
                  />
                  
                  {/* Separator */}
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                  
                  {/* Input Form Section - Now inside SERP Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white">
                      {t('form.title')}
                    </h3>
                    
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
                        maxLength={limits.TITLE_CHAR_LIMIT * 1.5}
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
                        {/* Real-time suggestions */}
                        {state.title.length > 0 && state.title.length < 30 && (
                          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            💡 {t('feedback.titleTooShort')}
                          </div>
                        )}
                        {state.title.length > 60 && (
                          <div className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            ⚠️ {t('feedback.titleTooLong')}
                          </div>
                        )}
                        {keywordArray.length > 0 && !keywordArray.some(k => state.title.toLowerCase().includes(k.toLowerCase())) && (
                          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            🔍 {t('feedback.titleNeedsKeyword')}
                          </div>
                        )}
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
                        {/* Real-time suggestions */}
                        {state.description.length > 0 && state.description.length < 120 && (
                          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            💡 {t('feedback.descriptionTooShort')}
                          </div>
                        )}
                        {state.description.length > 160 && (
                          <div className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            ⚠️ {t('feedback.descriptionTooLong')}
                          </div>
                        )}
                        {keywordArray.length > 0 && !keywordArray.some(k => state.description.toLowerCase().includes(k.toLowerCase())) && (
                          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            🔍 {t('feedback.descriptionNeedsKeyword')}
                          </div>
                        )}
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
                      </ul>                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            </HighlightBorder>
          </div>          {/* Right Column - SEO Analysis & Meta Tags (4/12 = 33.3%) */}
          <div className="xl:col-span-4 space-y-4">
            <HighlightBorder 
              isActive={currentHighlightStep === 3} 
              step={3}
              className="seo-analysis"
            >
              <div className="space-y-4">
                {/* SEO Analysis Panel - Compact */}
                <SEOAnalysisPanel
                  title={state.title}
                  description={state.description}
                  url={state.url}
                  keywords={keywordArray}
                />
                
                {/* Meta Tag Generator - Compact */}
                <MetaTagGenerator title={state.title} description={state.description} />
              </div>
            </HighlightBorder>
          </div>
        </div>

        {/* Onboarding Guide */}
        {showOnboarding && (
          <OnboardingGuide
            onClose={handleCloseOnboarding}
            onStepComplete={handleOnboardingStepComplete}
          />
        )}

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
