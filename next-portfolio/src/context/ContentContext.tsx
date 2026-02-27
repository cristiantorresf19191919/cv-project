'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioContent, PortfolioData } from '@/types/content';
import { DEFAULT_DATA, DEFAULT_PHOTO_URL } from '@/data/defaults';
import { isFirebaseConfigured } from '@/lib/firebase';

const ContentContext = createContext<PortfolioContent>({
  data: DEFAULT_DATA,
  photoUrl: DEFAULT_PHOTO_URL,
});

export function useContent(): PortfolioContent {
  return useContext(ContentContext);
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>({
    data: DEFAULT_DATA,
    photoUrl: DEFAULT_PHOTO_URL,
  });

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    async function fetchFromFirebase() {
      try {
        const { getFirestore } = await import('@/lib/firebase');
        const db = await getFirestore();
        if (!db) return;

        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'portfolio', 'content');
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const fbData = snap.data() as Partial<PortfolioData>;
          setContent(prev => ({
            data: { ...prev.data, ...fbData },
            photoUrl: prev.photoUrl,
          }));
        }

        const { getStorage } = await import('@/lib/firebase');
        const storage = await getStorage();
        if (storage) {
          const { ref, getDownloadURL } = await import('firebase/storage');
          try {
            const photoRef = ref(storage, 'profile/photo.jpg');
            const url = await getDownloadURL(photoRef);
            setContent(prev => ({ ...prev, photoUrl: url }));
          } catch {
            // Photo not in storage, use default
          }
        }
      } catch {
        // Firebase fetch failed, use defaults
      }
    }

    fetchFromFirebase();
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
