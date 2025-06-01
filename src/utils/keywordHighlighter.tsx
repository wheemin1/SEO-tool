
import React from 'react';

interface HighlightProps {
  children: React.ReactNode;
  className?: string;
}

const Highlight: React.FC<HighlightProps> = ({ children, className = '' }) => (
  <mark className={`font-bold text-blue-700 dark:text-blue-300 bg-transparent ${className}`}>
    {children}
  </mark>
);

export const highlightKeywords = (
  text: string, 
  keywords: string[], 
  caseSensitive: boolean = false
): React.ReactNode => {
  if (!keywords.length || !text) return text;

  // Filter out empty keywords and escape special regex characters
  const validKeywords = keywords
    .filter(keyword => keyword.trim())
    .map(keyword => keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!validKeywords.length) return text;

  // Create regex pattern for all keywords
  const flags = caseSensitive ? 'g' : 'gi';
  const keywordPattern = validKeywords.join('|');
  const regex = new RegExp(`(${keywordPattern})`, flags);
  
  // Split text by keywords while preserving the delimiters
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Check if this part is a keyword (case-insensitive comparison)
    const isKeyword = validKeywords.some(keyword => {
      const keywordRegex = new RegExp(`^${keyword}$`, caseSensitive ? '' : 'i');
      return keywordRegex.test(part);
    });
    
    return isKeyword ? (
      <Highlight key={index}>{part}</Highlight>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    );
  });
};

// Advanced highlighting with partial matches
export const highlightKeywordsAdvanced = (
  text: string,
  keywords: string[],
  options: {
    caseSensitive?: boolean;
    partialMatch?: boolean;
    minMatchLength?: number;
  } = {}
): React.ReactNode => {
  const {
    caseSensitive = false,
    partialMatch = false,
    minMatchLength = 3,
  } = options;

  if (!keywords.length || !text) return text;

  const validKeywords = keywords
    .filter(keyword => keyword.trim().length >= minMatchLength)
    .map(keyword => keyword.trim());

  if (!validKeywords.length) return text;

  let processedText = text;
  const highlights: Array<{ start: number; end: number; keyword: string }> = [];

  validKeywords.forEach(keyword => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = partialMatch ? escapedKeyword : `\\b${escapedKeyword}\\b`;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);

    let match;
    while ((match = regex.exec(text)) !== null) {
      highlights.push({
        start: match.index,
        end: match.index + match[0].length,
        keyword: match[0],
      });
    }
  });

  // Sort highlights by start position and merge overlapping ones
  const sortedHighlights = highlights
    .sort((a, b) => a.start - b.start)
    .reduce((merged, current) => {
      if (merged.length === 0) return [current];
      
      const last = merged[merged.length - 1];
      if (current.start <= last.end) {
        // Merge overlapping highlights
        last.end = Math.max(last.end, current.end);
        last.keyword = text.substring(last.start, last.end);
      } else {
        merged.push(current);
      }
      return merged;
    }, [] as typeof highlights);

  if (sortedHighlights.length === 0) return text;

  // Build the result with highlights
  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedHighlights.forEach((highlight, index) => {
    // Add text before highlight
    if (highlight.start > lastIndex) {
      result.push(text.substring(lastIndex, highlight.start));
    }

    // Add highlighted text
    result.push(
      <Highlight key={`highlight-${index}`}>
        {highlight.keyword}
      </Highlight>
    );

    lastIndex = highlight.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
};
