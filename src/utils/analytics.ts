/**
 * Lightweight analytics event tracker.
 * Sends events to a configurable endpoint. Falls back to console.debug in dev.
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
}

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const queue: AnalyticsEvent[] = [];
let flushing = false;

function flush() {
  if (flushing || queue.length === 0) return;
  flushing = true;

  const batch = queue.splice(0, queue.length);

  if (ENDPOINT) {
    // Send to analytics endpoint if configured
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    }).catch(() => {
      // Silently fail — analytics should never break the app
    });
  } else if (process.env.NODE_ENV === 'development') {
    for (const evt of batch) {
      console.debug('[analytics]', evt.event, evt.properties);
    }
  }

  flushing = false;
}

/**
 * Track an analytics event.
 * Events are batched and sent on the next idle callback.
 */
export function track(event: string, properties?: Record<string, string | number | boolean>) {
  queue.push({ event, properties, timestamp: Date.now() });

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(flush);
  } else {
    setTimeout(flush, 100);
  }
}

// Common event helpers
export const Analytics = {
  templateView: (template: string) => track('template_view', { template }),
  pdfDownload: (template: string) => track('pdf_download', { template }),
  contactSubmit: () => track('contact_submit'),
  languageToggle: (lang: string) => track('language_toggle', { lang }),
  commandPaletteOpen: () => track('command_palette_open'),
  sharePortfolio: (method: string) => track('share_portfolio', { method }),
  externalLink: (url: string) => track('external_link', { url }),
};
