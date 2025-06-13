import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, handleRedirectResult } from '../lib/firebase';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, setUser, setLoading } = useAuthStore();
  
  useEffect(() => {
    let isMounted = true;
    
    // Handle any pending redirect result first
    handleRedirectResult()
      .then((result) => {
        if (!isMounted) return;
        
        if (result) {
          const userData = {
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            emailVerified: result.user.emailVerified,
          };
          
          setUser(userData);
        }
      })
             .catch((error) => {
         // Handle redirect errors silently
       });

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isMounted) return;
      
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          emailVerified: firebaseUser.emailVerified,
        };
        
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setUser, setLoading]);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
};
