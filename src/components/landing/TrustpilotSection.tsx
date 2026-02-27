'use client';

import TrustBox from '../shared/TrustBox';

export function TrustpilotSection() {
  return (
    <section className="bg-slate-50 py-20 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-slate-600">
            Nuestra reputación se basa en la confianza y la excelencia en cada auditoría.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto flex justify-center">
          {/* Trustpilot Review Collector Widget */}
          <TrustBox 
            templateId="56278e9abfbbba0bdcd568bc"
            businessunitId="699f36b07ac84e3c59224579"
            token="a595f18e-ed5c-4857-b080-4c661aeeec77"
            height="52px"
            width="100%"
            theme="light"
          />
        </div>
      </div>
    </section>
  );
}
