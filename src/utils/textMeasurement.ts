
// Cache for canvas contexts to avoid repeated getContext calls
const contextCache = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();

const getContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
  if (contextCache.has(canvas)) {
    return contextCache.get(canvas)!;
  }
  
  const context = canvas.getContext('2d');
  if (context) {
    contextCache.set(canvas, context);
  }
  return context;
};

export const measureTextWidth = (text: string, font: string, canvas: HTMLCanvasElement): number => {
  if (!text) return 0;
  
  const context = getContext(canvas);
  if (!context) return 0;
  
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

export const truncateTextToPixelWidth = (
  text: string, 
  font: string, 
  maxWidth: number, 
  canvas: HTMLCanvasElement,
  ellipsis: string = '...'
): string => {
  if (!text) return text;
  
  const context = getContext(canvas);
  if (!context) return text;
  
  context.font = font;
  
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }
  
  let truncated = text;
  const ellipsisWidth = context.measureText(ellipsis).width;
  
  while (truncated.length > 0) {
    const currentWidth = context.measureText(truncated).width;
    if (currentWidth + ellipsisWidth <= maxWidth) {
      break;
    }
    truncated = truncated.slice(0, -1);
  }
  
  return truncated + ellipsis;
};

// Binary search for more efficient truncation
export const truncateTextToPixelWidthOptimized = (
  text: string,
  font: string,
  maxWidth: number,
  canvas: HTMLCanvasElement,
  ellipsis: string = '...'
): string => {
  if (!text) return text;
  
  const context = getContext(canvas);
  if (!context) return text;
  
  context.font = font;
  
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }
  
  const ellipsisWidth = context.measureText(ellipsis).width;
  let left = 0;
  let right = text.length;
  let bestFit = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const truncated = text.substring(0, mid);
    const width = context.measureText(truncated).width + ellipsisWidth;
    
    if (width <= maxWidth) {
      bestFit = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return text.substring(0, bestFit) + ellipsis;
};
