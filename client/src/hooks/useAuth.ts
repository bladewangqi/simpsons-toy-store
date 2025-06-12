import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, handleRedirectResult } from '../lib/firebase';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Handle redirect result first
    handleRedirectResult().then((result) => {
      if (result?.user) {
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        setUser(userData);
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
