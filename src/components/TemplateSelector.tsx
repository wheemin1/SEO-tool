import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Car, 
  Home, 
  Utensils, 
  Camera,
  Sparkles
} from 'lucide-react';

interface Template {
  id: string;
  nameKey: string;
  categoryKey: string;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  urlKey: string;
  keywordsKey: string;
  industryKey: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: {
    title: string;
    description: string;
    url: string;
    keywords: string;
  }) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const { t } = useTranslation();

  const templates: Template[] = [
    {
      id: 'ecommerce-1',
      nameKey: 'templates.examples.ecommerce.name',
      categoryKey: 'templates.categories.ecommerce',
      industryKey: 'templates.industries.retail',
      icon: <Store size={16} />,
      titleKey: 'templates.examples.ecommerce.title',
      descriptionKey: 'templates.examples.ecommerce.description',
      urlKey: 'templates.examples.ecommerce.url',
      keywordsKey: 'templates.examples.ecommerce.keywords'
    },
    {
      id: 'business-1',
      nameKey: 'templates.examples.business.name',
      categoryKey: 'templates.categories.business',
      industryKey: 'templates.industries.professional',
      icon: <Briefcase size={16} />,
      titleKey: 'templates.examples.business.title',
      descriptionKey: 'templates.examples.business.description',
      urlKey: 'templates.examples.business.url',
      keywordsKey: 'templates.examples.business.keywords'
    },
    {
      id: 'education-1',
      nameKey: 'templates.examples.education.name',
      categoryKey: 'templates.categories.education',
      industryKey: 'templates.industries.education',
      icon: <GraduationCap size={16} />,
      titleKey: 'templates.examples.education.title',
      descriptionKey: 'templates.examples.education.description',
      urlKey: 'templates.examples.education.url',
      keywordsKey: 'templates.examples.education.keywords'
    },
    {
      id: 'health-1',
      nameKey: 'templates.examples.health.name',
      categoryKey: 'templates.categories.health',
      industryKey: 'templates.industries.healthcare',
      icon: <Heart size={16} />,
      titleKey: 'templates.examples.health.title',
      descriptionKey: 'templates.examples.health.description',
      urlKey: 'templates.examples.health.url',
      keywordsKey: 'templates.examples.health.keywords'
    },
    {
      id: 'automotive-1',
      nameKey: 'templates.examples.automotive.name',
      categoryKey: 'templates.categories.automotive',
      industryKey: 'templates.industries.automotive',
      icon: <Car size={16} />,
      titleKey: 'templates.examples.automotive.title',
      descriptionKey: 'templates.examples.automotive.description',
      urlKey: 'templates.examples.automotive.url',
      keywordsKey: 'templates.examples.automotive.keywords'
    },
    {
      id: 'realestate-1',
      nameKey: 'templates.examples.realestate.name',
      categoryKey: 'templates.categories.realestate',
      industryKey: 'templates.industries.realestate',
      icon: <Home size={16} />,
      titleKey: 'templates.examples.realestate.title',
      descriptionKey: 'templates.examples.realestate.description',
      urlKey: 'templates.examples.realestate.url',
      keywordsKey: 'templates.examples.realestate.keywords'
    },
    {
      id: 'food-1',
      nameKey: 'templates.examples.food.name',
      categoryKey: 'templates.categories.food',
      industryKey: 'templates.industries.food',
      icon: <Utensils size={16} />,
      titleKey: 'templates.examples.food.title',
      descriptionKey: 'templates.examples.food.description',
      urlKey: 'templates.examples.food.url',
      keywordsKey: 'templates.examples.food.keywords'
    },
    {
      id: 'photography-1',
      nameKey: 'templates.examples.photography.name',
      categoryKey: 'templates.categories.creative',
      industryKey: 'templates.industries.photography',
      icon: <Camera size={16} />,
      titleKey: 'templates.examples.photography.title',
      descriptionKey: 'templates.examples.photography.description',
      urlKey: 'templates.examples.photography.url',
      keywordsKey: 'templates.examples.photography.keywords'
    }
  ];

  const categories = [...new Set(templates.map(t => t.categoryKey))];

  const handleTemplateClick = (template: Template) => {
    onSelectTemplate({
      title: t(template.titleKey),
      description: t(template.descriptionKey),
      url: t(template.urlKey),
      keywords: t(template.keywordsKey)
    });
  };  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-sm border-l-2 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
          <CardTitle className="flex items-center space-x-2 dark:text-white text-base">
            <Sparkles size={16} className="text-purple-500" />
            <span>{t('templates.title', 'Templates')}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">        <div className="space-y-3">
          {categories.map(categoryKey => (
            <div key={categoryKey} className="space-y-1">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t(categoryKey)}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {templates
                  .filter(template => template.categoryKey === categoryKey)
                  .map(template => (                    <Button
                      key={template.id}
                      variant="ghost"
                      className="h-auto p-2 justify-start text-left hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleTemplateClick(template)}
                    >
                      <div className="flex items-start space-x-2 w-full">
                        <div className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-gray-900 dark:text-white truncate">
                              {t(template.nameKey)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {t(template.industryKey)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                            {t(template.titleKey)}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>        
        <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border dark:border-amber-800">
          <div className="flex items-start space-x-2">
            <Sparkles size={12} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                {t('templates.tip.title', 'Pro Tip')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 line-clamp-2">
                {t('templates.tip.description', 'Use templates as starting points and customize for your content.')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
