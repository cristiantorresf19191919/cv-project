'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioContent, PortfolioData } from '@/types/content';
import { DEFAULT_DATA, DEFAULT_DATA_ES, DEFAULT_PHOTO_URL } from '@/data/defaults';
import { isFirebaseConfigured } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';

const ContentContext = createContext<PortfolioContent>({
  data: DEFAULT_DATA,
  photoUrl: DEFAULT_PHOTO_URL,
});

export function useContent(): PortfolioContent {
  return useContext(ContentContext);
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const [firebaseData, setFirebaseData] = useState<Partial<PortfolioData> | null>(null);
  const [photoUrl, setPhotoUrl] = useState(DEFAULT_PHOTO_URL);

  const baseData = lang === 'es' ? DEFAULT_DATA_ES : DEFAULT_DATA;
  const data = firebaseData ? { ...baseData, ...firebaseData } : baseData;

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
          setFirebaseData(snap.data() as Partial<PortfolioData>);
        }

        const { getStorage } = await import('@/lib/firebase');
        const storage = await getStorage();
        if (storage) {
          const { ref, getDownloadURL } = await import('firebase/storage');
          try {
            const photoRef = ref(storage, 'profile/photo.jpg');
            const url = await getDownloadURL(photoRef);
            setPhotoUrl(url);
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
    <ContentContext.Provider value={{ data, photoUrl }}>
      {children}
    </ContentContext.Provider>
  );
}
