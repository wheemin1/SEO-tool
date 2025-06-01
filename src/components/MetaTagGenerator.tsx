
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MetaTagGeneratorProps {
  title: string;
  description: string;
}

const MetaTagGenerator: React.FC<MetaTagGeneratorProps> = ({ title, description }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const generateMetaTags = () => {
    return `<meta name="title" content="${title}" />
<meta name="description" content="${description}" />`;
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
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between dark:text-white">
          {t('metaTags.title')}
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={copied ? t('metaTags.copied') : t('metaTags.copy')}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t('metaTags.copied') : t('metaTags.copy')}</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-600">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
            {generateMetaTags()}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaTagGenerator;
