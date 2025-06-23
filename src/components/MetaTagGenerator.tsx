import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ChevronDown, ChevronUp, Sparkles, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  title: string;
  description: string;
  region?: string;
}

interface MetaTagGeneratorProps {
  title: string;
  description: string;
  url?: string;
  keywords?: string;
  onApplyTemplate?: (template: { title: string; description: string }) => void;
}

const MetaTagGenerator: React.FC<MetaTagGeneratorProps> = ({ 
  title, 
  description, 
  url = window.location.href, 
  keywords = '',
  onApplyTemplate
}) => {
  const [copied, setCopied] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [includeOpenGraph, setIncludeOpenGraph] = useState(true);
  const [includeTwitterCard, setIncludeTwitterCard] = useState(true);
  const [includeCanonical, setIncludeCanonical] = useState(true);
  const [includeRobots, setIncludeRobots] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Add meta tag templates based on competitor analysis
  const templates: Template[] = [
    {
      id: 'global-1',
      title: 'SERP Simulator: Free Google Snippet Preview Tool',
      description: 'Our free tool lets you see how your title tag, URL and meta description appear in Google search results as you write them.',
      region: 'global'
    },
    {
      id: 'global-2',
      title: 'Google SERP Preview Tool | Test Meta Tags Online',
      description: 'Instantly preview how your website will look in Google search results. Test and optimize your title tags and meta descriptions for better CTR.',
      region: 'global'
    },
    {
      id: 'global-3',
      title: 'Meta Tags Generator & SERP Preview | Free SEO Tool',
      description: 'Create optimized title tags and meta descriptions with our free SERP preview tool. Generate HTML meta tags and see how your site appears in search results.',
      region: 'global'
    },
    {
      id: 'technical-1',
      title: 'SEO Meta Tags Simulator (Search Result Preview)',
      description: 'This tool provides a Google snippet preview to check how title tags and meta descriptions are displayed in search results.',
      region: 'global'
    },
    {
      id: 'kr-1',
      title: '구글 검색결과 미리보기: 무료 메타태그 생성기',
      description: '무료 SEO 도구로 메타 태그를 작성하면서 구글 검색결과에 어떻게 표시되는지 실시간으로 확인하세요.',
      region: 'kr'
    }
  ];

  const generateMetaTags = () => {
    let tags = `<!-- Basic Meta Tags -->
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />`;
    
    if (keywords && keywords.trim() !== '') {
      tags += `\n<meta name="keywords" content="${keywords}" />`;
    }
    
    if (includeCanonical) {
      tags += `\n\n<!-- Canonical Link -->
<link rel="canonical" href="${url}" />`;
    }
    
    if (includeRobots) {
      tags += `\n\n<!-- Search Engine Directives -->
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />`;
    }
    
    if (includeOpenGraph) {
      tags += `\n\n<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${url}/preview-image.svg" />`;
    }
    
    if (includeTwitterCard) {
      tags += `\n\n<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${url}/preview-image.svg" />`;
    }
    
    return tags;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTags());
      setCopied(true);
      toast({
        title: t('metaTags.copied', 'Copied!'),
        description: t('metaTags.copySuccess', 'Meta tags copied to clipboard'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: t('metaTags.copyError', 'Failed to copy to clipboard'),
        variant: "destructive",
      });
    }
  };

  const handleApplyTemplate = (template: Template) => {
    if (onApplyTemplate) {
      onApplyTemplate({
        title: template.title,
        description: template.description
      });
      toast({
        title: t('metaTags.templateApplied', 'Template Applied'),
        description: t('metaTags.templateAppliedDesc', 'The selected template has been applied'),
      });
      setIsTemplatesOpen(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-xl border-l-4 border-l-teal-500 h-full">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <CardTitle className="dark:text-white text-lg">
              {t('metaTags.title', 'Meta Tags Generator')}
            </CardTitle>
          </div>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={copied ? t('metaTags.copied', 'Copied!') : t('metaTags.copy', 'Copy')}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t('metaTags.copied', 'Copied!') : t('metaTags.copy', 'Copy')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pb-8">
        {onApplyTemplate && (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>{t('metaTags.suggestedTemplates', 'Suggested Templates')}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {t('metaTags.new', 'NEW')}
                </Badge>
              </div>
              {isTemplatesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            
            {isTemplatesOpen && (
              <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded border dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {t('metaTags.templateDesc', 'Click on a template to apply it to your meta tags. These are optimized for search engines based on best practices.')}
                </p>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {templates.filter(t => t.region === 'global' || t.region === undefined).map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      className="h-auto p-2 justify-start text-left hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center">
                          <Globe size={14} className="text-blue-500 mr-2" />
                          <span className="font-medium text-xs text-blue-700 dark:text-blue-300">
                            {template.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <span>{t('metaTags.advancedOptions', 'Advanced Options')}</span>
            {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          
          {isAdvancedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="openGraph" 
                  checked={includeOpenGraph} 
                  onCheckedChange={setIncludeOpenGraph} 
                />
                <Label htmlFor="openGraph">
                  {t('metaTags.includeOpenGraph', 'Include Open Graph Tags')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="twitterCard" 
                  checked={includeTwitterCard} 
                  onCheckedChange={setIncludeTwitterCard} 
                />
                <Label htmlFor="twitterCard">
                  {t('metaTags.includeTwitterCard', 'Include Twitter Card Tags')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="canonical" 
                  checked={includeCanonical} 
                  onCheckedChange={setIncludeCanonical} 
                />
                <Label htmlFor="canonical">
                  {t('metaTags.includeCanonical', 'Include Canonical Link')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="robots" 
                  checked={includeRobots} 
                  onCheckedChange={setIncludeRobots} 
                />
                <Label htmlFor="robots">
                  {t('metaTags.includeRobots', 'Include Robots Meta Tags')}
                </Label>
              </div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="preview">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preview">{t('metaTags.preview', 'Preview')}</TabsTrigger>
            <TabsTrigger value="code">{t('metaTags.code', 'Code')}</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600 space-y-2">
              <h2 className="text-md font-medium text-gray-800 dark:text-gray-200">{t('metaTags.includedTags', 'Included Tags')}:</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                <li>{t('metaTags.basicMeta', 'Basic Meta Tags (Title, Description)')}</li>
                {keywords && keywords.trim() !== '' && <li>{t('metaTags.keywordsMeta', 'Keywords Meta Tag')}</li>}
                {includeCanonical && <li>{t('metaTags.canonicalLink', 'Canonical Link')}</li>}
                {includeRobots && <li>{t('metaTags.robotsTags', 'Robots Meta Tags')}</li>}
                {includeOpenGraph && <li>{t('metaTags.ogTags', 'Open Graph / Facebook Tags')}</li>}
                {includeTwitterCard && <li>{t('metaTags.twitterTags', 'Twitter Card Tags')}</li>}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-600">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto">
                {generateMetaTags()}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>{t('metaTags.seoTip', 'SEO Tip: Good meta tags improve visibility in search results and social media sharing.')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaTagGenerator;
