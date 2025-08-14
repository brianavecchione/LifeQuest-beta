import React from 'react';

/**
 * Utility to detect URLs in text and convert them to clickable links
 * Supports http://, https://, and plain domain names
 */
export function linkifyText(text: string): React.ReactNode {
  if (!text) return text;

  // Enhanced URL regex that matches:
  // - http:// and https:// URLs
  // - www.domain.com
  // - domain.com (with common TLDs)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.(com|org|net|edu|gov|mil|int|co|io|me|ly|tv|cc|fm|to|uk|ca|de|fr|es|it|ru|cn|jp|au|br|in|mx|nl|se|no|dk|fi|pl|cz|sk|hu|ro|bg|hr|si|ee|lv|lt|mt|cy|lu|be|ie|pt|gr|is|ad|li|mc|sm|va|tr|az|ge|am|kz|kg|tj|tm|uz|af|pk|bd|bt|np|lk|mv|mm|la|kh|vn|th|my|sg|id|ph|bn|tw|kr|kp|mn|hk|mo)\b)/gi;

  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Determine the full URL
      let fullUrl = part;
      if (!part.startsWith('http://') && !part.startsWith('https://')) {
        fullUrl = part.startsWith('www.') ? `https://${part}` : `https://${part}`;
      }

      return (
        <a
          key={index}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Component wrapper for linkified text
 */
interface LinkifiedTextProps {
  children: string;
  className?: string;
}

export const LinkifiedText: React.FC<LinkifiedTextProps> = ({ children, className }) => {
  return (
    <span className={className}>
      {linkifyText(children)}
    </span>
  );
};