import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Debug function to verify Firebase configuration
export const verifyFirebaseConfig = () => {
  // Check if current domain matches expected patterns
  const expectedDomains = ['localhost', firebaseConfig.authDomain];
  const currentDomain = window.location.hostname;
  const domainMatch = expectedDomains.some(domain => 
    currentDomain === domain || currentDomain === domain.replace('.firebaseapp.com', '')
  );
  
  return {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    currentDomain,
    domainMatch
  };
};

const googleProvider = new GoogleAuthProvider();
// Add additional scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Try popup first (more reliable), fallback to redirect if popup fails
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    // If popup is blocked or fails, try redirect
    if (error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError: any) {
        throw redirectError;
      }
    } else {
      throw error;
    }
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error: any) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw error;
  }
};
