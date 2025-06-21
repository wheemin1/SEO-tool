import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface SEOScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  icon: string;
}

const SEOScoreCard: React.FC<SEOScoreCardProps> = React.memo(({ title, score, maxScore, color, icon }) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
  };

  const progressColors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <Card className={`${colorClasses[color]} border-2 transition-all hover:shadow-md`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
        <div className="text-xs font-medium mb-2">{title}</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className={`${progressColors[color]} h-1.5 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>        <div className="text-xs opacity-75 mt-1">{percentage}%</div>
      </CardContent>
    </Card>
  );
});

interface SEOScoreDashboardProps {
  title: string;
  description: string;
  url: string;
  keywords: string[];
}

export const SEOScoreDashboard: React.FC<SEOScoreDashboardProps> = React.memo(({ 
  title, 
  description, 
  url, 
  keywords 
}) => {
  const { t } = useTranslation();
  // 제목 점수 계산
  const titleScore = React.useMemo(() => {
    let score = 0;
    if (title.length > 0) score += 25;
    if (title.length <= 60) score += 25;
    if (title.length >= 30) score += 25;
    if (keywords.some(k => title.toLowerCase().includes(k.toLowerCase()))) score += 25;
    return score;
  }, [title, keywords]);

  // 설명 점수 계산
  const descriptionScore = React.useMemo(() => {
    let score = 0;
    if (description.length > 0) score += 25;
    if (description.length <= 160) score += 25;
    if (description.length >= 120) score += 25;
    if (keywords.some(k => description.toLowerCase().includes(k.toLowerCase()))) score += 25;
    return score;
  }, [description, keywords]);

  // 키워드 점수 계산
  const keywordScore = React.useMemo(() => {
    let score = 0;
    if (keywords.length > 0) score += 50;
    if (keywords.length >= 3) score += 50;
    return score;
  }, [keywords]);

  // 전체 점수 계산
  const overallScore = React.useMemo(() => {
    return Math.round((titleScore + descriptionScore + keywordScore) / 3);
  }, [titleScore, descriptionScore, keywordScore]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <SEOScoreCard
        title={t('seoScore.title')}
        score={titleScore}
        maxScore={100}
        color={titleScore >= 75 ? 'green' : titleScore >= 50 ? 'orange' : 'red'}
        icon="📝"
      />
      <SEOScoreCard
        title={t('seoScore.description')}
        score={descriptionScore}
        maxScore={100}
        color={descriptionScore >= 75 ? 'green' : descriptionScore >= 50 ? 'orange' : 'red'}
        icon="📄"
      />
      <SEOScoreCard
        title={t('seoScore.keywords')}
        score={keywordScore}
        maxScore={100}
        color={keywordScore >= 75 ? 'green' : keywordScore >= 50 ? 'orange' : 'red'}
        icon="🔍"
      />      <SEOScoreCard
        title={t('seoScore.overall')}
        score={overallScore}
        maxScore={100}
        color={overallScore >= 75 ? 'green' : overallScore >= 50 ? 'orange' : 'red'}
        icon="⭐"
      />
    </div>
  );
});
