import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import amplitude, {
  trackSignedIn,
  trackStartedSignup,
  trackCreatedAccount,
  trackEncounteredError,
  setUserId,
  setUserProperties,
} from '../../lib/amplitude';
import { set } from 'date-fns';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      
      // If popup authentication succeeded, result will be returned
      if (result) {
        // Set user ID for tracking
        setUserId(result.user.uid);
        setUserProperties({'account type': 0});
        if (mode === 'signup') {
          // Track that user successfully completed Google signup
          trackCreatedAccount('google');
        } else {
          // Track successful Google sign-in
          trackSignedIn('google');
        }
        
        onClose(); // Close the modal
        toast({
          title: "Welcome!",
          description: `Successfully signed in as ${result.user.displayName || result.user.email}`,
        });
      }
      // If redirect was used, the page will reload and we won't reach this point
    } catch (error: any) {
      // Track authentication error
      trackEncounteredError('authentication', 'google_signin_failed', error.code);
      
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password);
        
        // Set user ID and track successful sign-in
        setUserId(result.user.uid);
        setUserProperties({'account type': 1});
        trackSignedIn('email');
      } else {
        
        const result = await signUpWithEmail(email, password);

        // Set user ID and track successful account creation
        setUserId(result.user.uid);
        setUserProperties({'account type': 1});
        trackCreatedAccount('email');
      }
      
      onClose();
      toast({
        title: "Success",
        description: mode === 'signin' ? "Welcome back!" : "Account created successfully!",
      });
    } catch (error: any) {
      console.error('Email auth error:', error);
      
      // Track authentication error
      trackEncounteredError('authentication', `email_${mode}_failed`, error.code);
      
      // Handle specific Firebase auth errors
      let errorTitle = "Authentication Error";
      let errorDescription = "Authentication failed";
      
      switch (error.code) {
        case 'auth/invalid-credential':
          if (mode === 'signin') {
            errorTitle = "Invalid Login";
            errorDescription = "The email or password is incorrect. Please check your credentials or create a new account.";
          } else {
            errorDescription = "Invalid credentials provided";
          }
          break;
          
        case 'auth/user-not-found':
          errorTitle = "Account Not Found";
          errorDescription = "No account found with this email. Would you like to create a new account?";
          break;
          
        case 'auth/wrong-password':
          errorTitle = "Incorrect Password";
          errorDescription = "The password is incorrect. Please try again or reset your password.";
          break;
          
        case 'auth/email-already-in-use':
          errorTitle = "Email Already Registered";
          errorDescription = "An account with this email already exists. Please sign in instead.";
          break;
          
        case 'auth/weak-password':
          errorTitle = "Weak Password";
          errorDescription = "Password should be at least 6 characters long";
          break;
          
        case 'auth/invalid-email':
          errorTitle = "Invalid Email";
          errorDescription = "Please enter a valid email address";
          break;
          
        case 'auth/too-many-requests':
          errorTitle = "Too Many Attempts";
          errorDescription = "Too many failed attempts. Please try again later.";
          break;
          
        default:
          errorDescription = error.message || "Authentication failed. Please try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
      
      // Auto-suggest switching modes for certain errors
      if (error.code === 'auth/user-not-found' && mode === 'signin') {
        setTimeout(() => {
          toast({
            title: "Suggestion",
            description: "Try creating a new account instead",
            action: (
              <button 
                onClick={() => setMode('signup')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign Up
              </button>
            ),
          });
        }, 2000);
      } else if (error.code === 'auth/email-already-in-use' && mode === 'signup') {
        setTimeout(() => {
          toast({
            title: "Suggestion", 
            description: "Try signing in instead",
            action: (
              <button 
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
              </button>
            ),
          });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    if (mode === 'signup') {
      trackStartedSignup();
    }
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Login */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            <i className="fab fa-google" />
            <span>Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="homer@springfield.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 mr-2" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-blue-900 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2" />
              ) : (
                <i className={`fas ${mode === 'signin' ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2`} />
              )}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={toggleMode}
              className="text-blue-900 hover:text-blue-700 font-semibold"
            >
              {mode === 'signin' ? 'Sign up now' : 'Sign in'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
