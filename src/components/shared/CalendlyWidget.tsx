'use client';

import { InlineWidget, useCalendlyEventListener } from "react-calendly";

interface CalendlyWidgetProps {
  url: string;
  prefill?: {
    email?: string;
    name?: string;
    guests?: string[]; // email addresses
  };
  onEventScheduled?: (e: any) => void;
}

export function CalendlyWidget({ url, prefill, onEventScheduled }: CalendlyWidgetProps) {
  
  useCalendlyEventListener({
    onProfilePageViewed: () => console.log("onProfilePageViewed"),
    onDateAndTimeSelected: () => console.log("onDateAndTimeSelected"),
    onEventTypeViewed: () => console.log("onEventTypeViewed"),
    onEventScheduled: (e) => {
      console.log("Event Scheduled", e);
      if (onEventScheduled) onEventScheduled(e);
    },
  });

  return (
    <div className="w-full h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <InlineWidget
        url={url}
        prefill={prefill}
        styles={{ height: '700px' }}
        pageSettings={{
          backgroundColor: 'ffffff',
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: '0069ff',
          textColor: '4d5055'
        }}
      />
    </div>
  );
}
