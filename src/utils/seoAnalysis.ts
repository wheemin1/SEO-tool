interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: string[];
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  messageKey: string;
  messageParams?: Record<string, any>;
  field: 'title' | 'description' | 'url' | 'keywords';
}

export const analyzeSEO = (
  title: string,
  description: string,
  url: string,
  keywords: string[]
): SEOAnalysis => {
  const issues: SEOIssue[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Title analysis
  if (!title.trim()) {
    issues.push({
      type: 'error',
      messageKey: 'seoAnalysis.issues.titleRequired',
      field: 'title'
    });
    score -= 25;
  } else {
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.titleTooShort',
        field: 'title'
      });
      score -= 10;
      recommendations.push('seoAnalysis.recommendationsList.optimizeTitle');
    }
    
    if (title.length > 60) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.titleTooLong',
        messageParams: { limit: 60 },
        field: 'title'
      });
      score -= 10;
    }    if (keywords.length > 0 && !keywords.some(keyword =>
      title.toLowerCase().includes(keyword.toLowerCase())
    )) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.titleNoKeywords',
        field: 'title'
      });
      score -= 15;
      recommendations.push('seoAnalysis.recommendationsList.includeKeywordInTitle');
    }

    if (title.split(' ').length < 3) {
      issues.push({
        type: 'info',
        messageKey: 'seoAnalysis.issues.titleNeedsMoreWords',
        field: 'title'
      });
      score -= 5;
    }
  }
  // Description analysis
  if (!description.trim()) {
    issues.push({
      type: 'error',
      messageKey: 'seoAnalysis.issues.descriptionRequired',
      field: 'description'
    });
    score -= 20;  } else {
    if (description.length < 120) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.descriptionTooShort',
        messageParams: { minLength: 120 },
        field: 'description'
      });
      score -= 10;
      recommendations.push('seoAnalysis.recommendationsList.expandDescription');
    }
    
    if (description.length > 160) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.descriptionTooLong',
        messageParams: { maxLength: 160 },
        field: 'description'
      });
      score -= 10;
    }    if (keywords.length > 0 && !keywords.some(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    )) {
      issues.push({
        type: 'info',
        messageKey: 'seoAnalysis.issues.descriptionNoKeywords',
        field: 'description'
      });
      score -= 5;
      recommendations.push('seoAnalysis.recommendationsList.includeKeywordsInDescription');
    }

    // Check for call-to-action words
    const ctaWords = ['learn', 'discover', 'find', 'get', 'download', 'try', 'start', 'explore'];
    const hasCallToAction = ctaWords.some(word => 
      description.toLowerCase().includes(word)
    );
      if (!hasCallToAction) {
      issues.push({
        type: 'info',
        messageKey: 'seoAnalysis.issues.descriptionNeedsCta',
        field: 'description'
      });
      recommendations.push('seoAnalysis.recommendationsList.addCallToAction');
    }
  }

  // URL analysis
  try {
    new URL(url);
      if (url.length > 100) {
      issues.push({
        type: 'warning',
        messageKey: 'seoAnalysis.issues.urlTooLong',
        field: 'url'
      });
      score -= 5;
    }    // Check for hyphens vs underscores
    const path = new URL(url).pathname;
    if (path.includes('_')) {
      issues.push({
        type: 'info',
        messageKey: 'seoAnalysis.issues.urlUsesUnderscores',
        field: 'url'
      });
      recommendations.push('seoAnalysis.recommendationsList.useHyphensInUrl');
    }

    // Check for dynamic parameters
    if (url.includes('?') && new URL(url).searchParams.toString().length > 50) {
      issues.push({
        type: 'info',
        messageKey: 'seoAnalysis.issues.urlTooManyParams',
        field: 'url'
      });
    }
  } catch {
    issues.push({
      type: 'error',
      messageKey: 'seoAnalysis.issues.urlInvalid',
      field: 'url'
    });
    score -= 15;
  }
  // Keywords analysis
  if (keywords.length === 0) {
    issues.push({
      type: 'warning',
      messageKey: 'seoAnalysis.issues.noKeywords',
      field: 'keywords'
    });
    score -= 10;
    recommendations.push('seoAnalysis.recommendationsList.addKeywords');
  } else if (keywords.length > 5) {
    issues.push({
      type: 'warning',
      messageKey: 'seoAnalysis.issues.tooManyKeywords',
      field: 'keywords'
    });
    score -= 5;
    recommendations.push('seoAnalysis.recommendationsList.focusOnMainKeywords');
  }
  // Additional recommendations based on overall analysis
  if (score > 80) {
    recommendations.push('seoAnalysis.recommendationsList.excellent');
  } else if (score > 60) {
    recommendations.push('seoAnalysis.recommendationsList.goodFoundation');
  } else {
    recommendations.push('seoAnalysis.recommendationsList.needsAttention');
  }

  return {
    score: Math.max(0, Math.round(score)),
    issues,
    recommendations
  };
};

// Calculate readability score (simplified Flesch reading ease)
export const calculateReadabilityScore = (text: string): number => {
  if (!text.trim()) return 0;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Simplified Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Simple syllable counter
const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

// Keyword density calculator
export const calculateKeywordDensity = (text: string, keyword: string): number => {
  if (!text || !keyword) return 0;
  
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const keywordWords = keyword.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0 || keywordWords.length === 0) return 0;
  
  let count = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ');
    if (phrase === keyword.toLowerCase()) {
      count++;
    }
  }
  
  return (count / words.length) * 100;
};
