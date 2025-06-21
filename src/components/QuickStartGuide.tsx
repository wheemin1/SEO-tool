import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Play, Zap, Target, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickStartGuideProps {
  onStartGuide: () => void;
  onQuickStart: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ 
  onStartGuide, 
  onQuickStart 
}) => {
  const { t } = useTranslation();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      title: t('quickStart.step1.title', '템플릿 선택'),
      description: t('quickStart.step1.description', '업종별 최적화된 템플릿'),
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      time: '30초'
    },
    {
      number: 2,
      title: t('quickStart.step2.title', '내용 입력'),
      description: t('quickStart.step2.description', '제목, 설명, URL 수정'),
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      time: '2분'
    },
    {
      number: 3,
      title: t('quickStart.step3.title', 'SEO 확인'),
      description: t('quickStart.step3.description', '실시간 분석 및 최적화'),
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      time: '1분'
    }
  ];

  return (
    <Card className="mb-6 border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('quickStart.title', '🚀 3분만에 SEO 최적화 완성!')}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {t('quickStart.subtitle', '처음 사용하시나요? 간단한 가이드로 빠르게 시작해보세요!')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 단계별 미리보기 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                hoveredStep === index 
                  ? 'border-blue-300 shadow-lg scale-105 dark:border-blue-600' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${step.color}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {step.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* 화살표 (마지막 단계 제외) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onStartGuide}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('quickStart.startGuide', '단계별 가이드 시작')}
          </Button>
          
          <Button
            onClick={onQuickStart}
            variant="outline"
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            {t('quickStart.quickStart', '바로 시작하기')}
          </Button>
        </div>
        
        {/* 추가 정보 */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>{t('quickStart.guarantee', '무료 • 회원가입 불필요 • 즉시 사용 가능')}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
