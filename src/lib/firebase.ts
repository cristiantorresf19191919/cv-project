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

/* ═══════════════════════════════════════════════════════
   Visitor Presence — real-time "X people viewing now"
   ═══════════════════════════════════════════════════════ */

let visitorDocId: string | null = null;

export async function registerVisitorPresence(): Promise<(() => void) | null> {
  try {
    const db = await getFirestore();
    if (!db) return null;

    const { collection, addDoc, deleteDoc, doc, serverTimestamp } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'visitors_live'), {
      joinedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    });
    visitorDocId = docRef.id;

    // Heartbeat: update lastSeen every 30s
    const interval = setInterval(async () => {
      try {
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'visitors_live', docRef.id), { lastSeen: serverTimestamp() });
      } catch { /* visitor may have been cleaned up */ }
    }, 30000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      if (visitorDocId) {
        deleteDoc(doc(db, 'visitors_live', visitorDocId)).catch(() => {});
        visitorDocId = null;
      }
    };
  } catch {
    return null;
  }
}

export async function subscribeToVisitorCount(callback: (count: number) => void): Promise<(() => void) | null> {
  try {
    const db = await getFirestore();
    if (!db) return null;

    const { collection, query, where, onSnapshot, Timestamp } = await import('firebase/firestore');
    // Only count visitors seen in the last 60 seconds
    const cutoff = Timestamp.fromDate(new Date(Date.now() - 60000));
    const q = query(collection(db, 'visitors_live'), where('lastSeen', '>', cutoff));

    const unsub = onSnapshot(q, (snap) => {
      callback(snap.size);
    });
    return unsub;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════
   Page View Analytics — total views + daily sparkline
   ═══════════════════════════════════════════════════════ */

export async function recordPageView(): Promise<void> {
  try {
    const db = await getFirestore();
    if (!db) return;

    const { doc, setDoc, increment, serverTimestamp } = await import('firebase/firestore');
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Increment total counter
    await setDoc(doc(db, 'analytics', 'views'), { total: increment(1), lastVisit: serverTimestamp() }, { merge: true });

    // Increment daily counter
    await setDoc(doc(db, 'analytics_daily', today), { count: increment(1), date: today }, { merge: true });
  } catch { /* analytics should never block UX */ }
}

export async function getPageViewData(): Promise<{ total: number; daily: { date: string; count: number }[] }> {
  try {
    const db = await getFirestore();
    if (!db) return { total: 0, daily: [] };

    const { doc, getDoc, collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');

    // Get total
    const viewsSnap = await getDoc(doc(db, 'analytics', 'views'));
    const total = viewsSnap.exists() ? (viewsSnap.data().total ?? 0) : 0;

    // Get last 14 days
    const q = query(collection(db, 'analytics_daily'), orderBy('date', 'desc'), limit(14));
    const dailySnap = await getDocs(q);
    const daily = dailySnap.docs.map((d) => ({ date: d.data().date, count: d.data().count })).reverse();

    return { total, daily };
  } catch {
    return { total: 0, daily: [] };
  }
}

/* ═══════════════════════════════════════════════════════
   Reaction Hotspots — emoji reactions on sections
   ═══════════════════════════════════════════════════════ */

export type ReactionType = 'fire' | 'heart' | 'rocket' | 'hundred';

export async function toggleReaction(sectionId: string, reaction: ReactionType): Promise<void> {
  try {
    const db = await getFirestore();
    if (!db) return;

    const { doc, setDoc, increment } = await import('firebase/firestore');
    await setDoc(doc(db, 'reactions', sectionId), { [reaction]: increment(1) }, { merge: true });
  } catch { /* reactions should never block UX */ }
}

export async function getReactions(sectionId: string): Promise<Record<ReactionType, number>> {
  try {
    const db = await getFirestore();
    if (!db) return { fire: 0, heart: 0, rocket: 0, hundred: 0 };

    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'reactions', sectionId));
    if (!snap.exists()) return { fire: 0, heart: 0, rocket: 0, hundred: 0 };

    const data = snap.data();
    return {
      fire: data.fire ?? 0,
      heart: data.heart ?? 0,
      rocket: data.rocket ?? 0,
      hundred: data.hundred ?? 0,
    };
  } catch {
    return { fire: 0, heart: 0, rocket: 0, hundred: 0 };
  }
}

export async function subscribeToReactions(sectionId: string, callback: (reactions: Record<ReactionType, number>) => void): Promise<(() => void) | null> {
  try {
    const db = await getFirestore();
    if (!db) return null;

    const { doc, onSnapshot } = await import('firebase/firestore');
    const unsub = onSnapshot(doc(db, 'reactions', sectionId), (snap) => {
      if (!snap.exists()) {
        callback({ fire: 0, heart: 0, rocket: 0, hundred: 0 });
        return;
      }
      const data = snap.data();
      callback({
        fire: data.fire ?? 0,
        heart: data.heart ?? 0,
        rocket: data.rocket ?? 0,
        hundred: data.hundred ?? 0,
      });
    });
    return unsub;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════
   Live Availability — real-time status from Firestore
   ═══════════════════════════════════════════════════════ */

export interface AvailabilityStatus {
  status: 'open' | 'busy' | 'closed';
  message: string;
  emoji: string;
  updatedAt?: { seconds: number; nanoseconds: number };
}

export async function subscribeToAvailability(callback: (status: AvailabilityStatus) => void): Promise<(() => void) | null> {
  try {
    const db = await getFirestore();
    if (!db) return null;

    const { doc, onSnapshot } = await import('firebase/firestore');
    const unsub = onSnapshot(doc(db, 'portfolio', 'availability'), (snap) => {
      if (!snap.exists()) {
        callback({ status: 'open', message: 'Open to Work', emoji: '🟢' });
        return;
      }
      callback(snap.data() as AvailabilityStatus);
    });
    return unsub;
  } catch {
    return null;
  }
}
