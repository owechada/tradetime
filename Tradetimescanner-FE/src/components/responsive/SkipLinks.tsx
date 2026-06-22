import React from 'react';
import { useSkipLinks } from '../../hooks/useAccessibility';
import { getSkipLinkClasses } from '../../utils/accessibilityUtils';

interface SkipLinksProps {
  links?: Array<{ id: string; label: string }>;
}

/**
 * Skip Links component for keyboard navigation accessibility
 * Provides quick navigation to main content areas
 */
const SkipLinks: React.FC<SkipLinksProps> = ({ links: propLinks }) => {
  const { skipLinks, skipToContent } = useSkipLinks();
  
  // Use provided links or default skip links
  const linksToRender = propLinks || skipLinks.length > 0 ? skipLinks : [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'navigation', label: 'Skip to navigation' },
    { id: 'footer', label: 'Skip to footer' }
  ];

  if (linksToRender.length === 0) {
    return null;
  }

  return (
    <div className="skip-links">
      {linksToRender.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className={getSkipLinkClasses()}
          onClick={(e) => {
            e.preventDefault();
            skipToContent(link.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              skipToContent(link.id);
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;