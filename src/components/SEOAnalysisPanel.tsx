import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { analyzeSEO, calculateReadabilityScore, calculateKeywordDensity } from '@/utils/seoAnalysis';

interface SEOAnalysisProps {
  title: string;
  description: string;
  url: string;
  keywords: string[];
}

const SEOAnalysisPanel: React.FC<SEOAnalysisProps> = ({
  title,
  description,
  url,
  keywords,
}) => {
  const { t } = useTranslation();

  const analysis = useMemo(() => {
    return analyzeSEO(title, description, url, keywords);
  }, [title, description, url, keywords]);

  const readabilityScore = useMemo(() => {
    return calculateReadabilityScore(description);
  }, [description]);

  const keywordDensities = useMemo(() => {
    return keywords.slice(0, 3).map(keyword => ({
      keyword,
      titleDensity: calculateKeywordDensity(title, keyword),
      descriptionDensity: calculateKeywordDensity(description, keyword),
    }));
  }, [title, description, keywords]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <CheckCircle size={16} className="text-blue-500" />;
    }
  };
  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: t('seoAnalysis.readability.levels.veryEasy'), color: 'text-green-600' };
    if (score >= 80) return { level: t('seoAnalysis.readability.levels.easy'), color: 'text-green-500' };
    if (score >= 70) return { level: t('seoAnalysis.readability.levels.fairlyEasy'), color: 'text-yellow-500' };
    if (score >= 60) return { level: t('seoAnalysis.readability.levels.standard'), color: 'text-yellow-600' };
    if (score >= 50) return { level: t('seoAnalysis.readability.levels.fairlyDifficult'), color: 'text-orange-500' };
    if (score >= 30) return { level: t('seoAnalysis.readability.levels.difficult'), color: 'text-red-500' };
    return { level: t('seoAnalysis.readability.levels.veryDifficult'), color: 'text-red-600' };
  };

  const readabilityInfo = getReadabilityLevel(readabilityScore);  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-xl border-l-4 border-l-orange-500 h-full">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <CardTitle className="flex items-center space-x-2 dark:text-white text-lg">
            <TrendingUp size={20} />
            <span>{t('seoAnalysis.title')}</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={`ml-auto ${getScoreColor(analysis.score)}`}
          >
            {t('seoAnalysis.overallScore')}: {analysis.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pb-8">{/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium dark:text-gray-200">
              {t('seoAnalysis.overallScore')}
            </span>
            <span className={`text-sm font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}%
            </span>
          </div>
          <Progress
            value={analysis.score}
            className="h-2"
          />
        </div>

        <Separator />

        {/* Issues */}
        {analysis.issues.length > 0 && (
          <div className="space-y-3">            <h4 className="font-medium text-sm dark:text-gray-200 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{t('seoAnalysis.issuesFound')} ({analysis.issues.length})</span>
            </h4>
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-2 rounded bg-gray-50 dark:bg-gray-700"
                >
                  {getIssueIcon(issue.type)}                  <div className="flex-1 text-sm">
                    <span className="text-gray-900 dark:text-gray-100">
                      {String(t(issue.messageKey, issue.messageParams))}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {issue.field}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Readability Score */}        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium dark:text-gray-200">
              {t('seoAnalysis.readability.title')}
            </span>
            <span className={`text-sm font-bold ${readabilityInfo.color}`}>
              {readabilityInfo.level}
            </span>
          </div>
          <Progress value={readabilityScore} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('seoAnalysis.readability.score', { score: readabilityScore })}
          </p>
        </div>

        <Separator />

        {/* Keyword Density */}
        {keywordDensities.length > 0 && (
          <div className="space-y-3">            <h4 className="font-medium text-sm dark:text-gray-200 flex items-center space-x-2">
              <Target size={16} />
              <span>{t('seoAnalysis.keywordDensity.title')}</span>
            </h4>
            <div className="space-y-3">
              {keywordDensities.map(({ keyword, titleDensity, descriptionDensity }, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      "{keyword}"
                    </span>
                  </div>                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('seoAnalysis.keywordDensity.title_')}: </span>
                      <span className={titleDensity > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                        {titleDensity.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('seoAnalysis.keywordDensity.description')}: </span>
                      <span className={descriptionDensity > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                        {descriptionDensity.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-3">            <h4 className="font-medium text-sm dark:text-gray-200">
              {t('seoAnalysis.recommendations')}
            </h4>            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2"
                >
                  <span className="text-green-500 mt-1">•</span>
                  <span>{String(t(recommendation))}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOAnalysisPanel;
