import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (!isFirebaseConfigured()) return null;
  if (app) return app;

  const { initializeApp } = await import('firebase/app');
  app = initializeApp(firebaseConfig);
  return app;
}

export async function getFirestore(): Promise<Firestore | null> {
  if (!isFirebaseConfigured()) return null;
  if (db) return db;

  const firebaseApp = await getFirebaseApp();
  if (!firebaseApp) return null;

  const { getFirestore: getFs } = await import('firebase/firestore');
  db = getFs(firebaseApp);
  return db;
}

export async function getStorage(): Promise<FirebaseStorage | null> {
  if (!isFirebaseConfigured()) return null;
  if (storage) return storage;

  const firebaseApp = await getFirebaseApp();
  if (!firebaseApp) return null;

  const { getStorage: getSt } = await import('firebase/storage');
  storage = getSt(firebaseApp);
  return storage;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export async function submitContactMessage(data: Omit<ContactSubmission, 'createdAt'>): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = await getFirestore();
    if (!db) return { ok: false, error: 'Firebase not configured' };

    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    await addDoc(collection(db, 'contacts'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to send message';
    return { ok: false, error: msg };
  }
}
