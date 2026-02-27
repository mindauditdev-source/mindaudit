'use client';

import { useEffect, useRef } from 'react';

interface TrustBoxProps {
  /**
   * The Trustpilot Template ID for the widget layout.
   */
  templateId: string;
  /**
   * The Trustpilot Business Unit ID (unique to MindAudit).
   */
  businessunitId: string;
  /**
   * Optional custom classes for styling the container.
   */
  className?: string;
  /**
   * Height of the widget (e.g., '52px', '500px').
   */
  height?: string;
  /**
   * Width of the widget (e.g., '100%').
   */
  width?: string;
  /**
   * Theme mode (light or dark).
   */
  theme?: 'light' | 'dark';
  /**
   * Star color for the widget.
   */
  stars?: string;
  /**
   * Language/Locale code (e.g., 'es-ES').
   */
  locale?: string;
  /**
   * Optional token for specific widgets (like Review Collector).
   */
  token?: string;
}

const TrustBox = ({
  templateId,
  businessunitId,
  className = '',
  height = '52px',
  width = '100%',
  theme = 'light',
  stars,
  locale = 'es-ES',
  token,
}: TrustBoxProps) => {
  // Reference to the element where Trustpilot will inject the widget
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the window.Trustpilot object is loaded and the element exists
    if (window.Trustpilot && ref.current) {
      window.Trustpilot.loadFromElement(ref.current);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className}`}
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={businessunitId}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
      {...(stars ? { 'data-stars': stars } : {})}
      {...(token ? { 'data-token': token } : {})}
    >
      <a
        href="https://es.trustpilot.com/review/mindaudit.es"
        target="_blank"
        rel="noopener"
      >
        Trustpilot
      </a>
    </div>
  );
};

export default TrustBox;

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Trustpilot: any;
  }
}
