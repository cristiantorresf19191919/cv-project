'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return { copied, copy };
}
