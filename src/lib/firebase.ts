import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? firebaseConfigJson.firestoreDatabaseId
  : undefined;

function createFirestoreInstance() {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    }, databaseId);
  } catch {
    try {
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true
      }, databaseId);
    } catch {
      return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    }
  }
}

// Initialize Firestore with auto-detect long polling and multi-tab sync
export const db = createFirestoreInstance();

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  writeBatch
};
