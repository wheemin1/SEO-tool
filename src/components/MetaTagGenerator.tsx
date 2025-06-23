import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MetaTagGeneratorProps {
  title: string;
  description: string;
  url?: string;
  keywords?: string;
}

const MetaTagGenerator: React.FC<MetaTagGeneratorProps> = ({ 
  title, 
  description, 
  url = window.location.href, 
  keywords = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [includeOpenGraph, setIncludeOpenGraph] = useState(true);
  const [includeTwitterCard, setIncludeTwitterCard] = useState(true);
  const [includeCanonical, setIncludeCanonical] = useState(true);
  const [includeRobots, setIncludeRobots] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  const generateMetaTags = () => {
    let tags = `<!-- 기본 메타 태그 -->
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />`;
    
    if (keywords && keywords.trim() !== '') {
      tags += `\n<meta name="keywords" content="${keywords}" />`;
    }
    
    if (includeCanonical) {
      tags += `\n\n<!-- 표준 링크 -->
<link rel="canonical" href="${url}" />`;
    }
    
    if (includeRobots) {
      tags += `\n\n<!-- 검색 엔진 지시사항 -->
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
        title: t('metaTags.copied'),
        description: t('metaTags.copySuccess'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: t('metaTags.copyError'),
        variant: "destructive",
      });
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
