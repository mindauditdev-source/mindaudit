import React from 'react';

export function JsonLd() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MindAudit Spain SLP',
    url: 'https://www.mindaudit.es',
    logo: 'https://www.mindaudit.es/logo/mindaudit-logo.png', // Update with actual logo URL
    description: 'Firma boutique de auditoría que combina rigor profesional con tecnología moderna.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
      // Add more specific address if known
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '', // Add phone
      contactType: 'customer service',
      email: 'info@mindaudit.es',
    },
    sameAs: [
      // Add social media links here
      'https://www.linkedin.com/company/mindaudit-spain',
    ],
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MindAudit® Spain',
    url: 'https://www.mindaudit.es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.mindaudit.es/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}
