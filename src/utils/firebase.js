import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let auth;
let db;
let messaging;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Messaging only works in HTTPS or localhost
    if (typeof window !== 'undefined' && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      messaging = getMessaging(app);
    }
  } else {
    console.warn('Firebase configuration is incomplete. Some features may not work.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db, messaging };

// Authentication functions
export async function loginUser(email, password) {
  try {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
}

export async function logoutUser() {
  try {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed. Please try again.');
  }
}

export function onAuthStateChange(callback) {
  if (!auth) {
    console.warn('Firebase Auth is not initialized');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Firestore functions for storing user data and alerts
export async function saveUserProfile(userId, profileData) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const docRef = await addDoc(collection(db, 'userProfiles'), {
      userId,
      ...profileData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save profile. Please try again.');
  }
}

export async function savePreparednessPlan(userId, planData) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const docRef = await addDoc(collection(db, 'preparednessPlans'), {
      userId,
      ...planData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving preparedness plan:', error);
    throw new Error('Failed to save plan. Please try again.');
  }
}

export async function getUserPlans(userId) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const q = query(
      collection(db, 'preparednessPlans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw new Error('Failed to fetch plans. Please try again.');
  }
}

export async function saveAlert(userId, alertData) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const docRef = await addDoc(collection(db, 'alerts'), {
      userId,
      ...alertData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving alert:', error);
    throw new Error('Failed to save alert. Please try again.');
  }
}

export async function getUserAlerts(userId) {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const q = query(
      collection(db, 'alerts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    throw new Error('Failed to fetch alerts. Please try again.');
  }
}

// Cloud Messaging functions for push notifications
export async function requestNotificationPermission() {
  try {
    if (!messaging) {
      console.warn('Firebase Messaging is not initialized');
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

export function onMessageReceived(callback) {
  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return () => {};
  }
  return onMessage(messaging, callback);
}
