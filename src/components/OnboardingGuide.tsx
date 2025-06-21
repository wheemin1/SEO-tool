import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, Sparkles, Edit3, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingGuideProps {
  onClose: () => void;
  onStepComplete: (step: number) => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onClose, onStepComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const steps = [
    {
      title: t('onboarding.step1.title', '1️⃣ 템플릿 선택'),
      description: t('onboarding.step1.description', '왼쪽에서 업종별 템플릿을 선택하여 빠르게 시작하세요'),
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      target: 'template-selector',
      position: 'right'
    },
    {
      title: t('onboarding.step2.title', '2️⃣ 내용 수정'),
      description: t('onboarding.step2.description', '가운데에서 제목, 설명, URL을 수정하세요'),
      icon: <Edit3 className="w-5 h-5 text-blue-500" />,
      target: 'serp-preview',
      position: 'top'
    },
    {
      title: t('onboarding.step3.title', '3️⃣ SEO 분석'),
      description: t('onboarding.step3.description', '오른쪽에서 SEO 점수와 개선사항을 확인하세요'),
      icon: <BarChart3 className="w-5 h-5 text-green-500" />,
      target: 'seo-analysis',
      position: 'left'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepComplete(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    // 5초 후 자동으로 다음 단계로 이동 (선택사항)
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        handleNext();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300" />
      
      {/* Guide Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in duration-300">
        <Card className="w-96 border-2 border-blue-200 shadow-2xl bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentStepData.icon}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('onboarding.progress', '진행도')}</span>
                <span>{currentStep + 1} / {steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleClose}
                className="text-sm"
              >
                {t('onboarding.skip', '건너뛰기')}
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    {t('onboarding.next', '다음')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  t('onboarding.start', '시작하기!')
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OnboardingGuide;
