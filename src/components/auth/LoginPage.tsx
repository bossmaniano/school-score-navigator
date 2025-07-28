import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInSchema, signUpSchema } from '@/lib/validations';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      console.log('User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        toast({
          title: 'Validation Error',
          description: result.error.issues[0].message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log('Attempting to sign in...');
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      } else {
        console.log('Sign in successful');
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        // Don't set loading to false here - let the auth context handle it
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const result = signUpSchema.safeParse({ 
        fullName, 
        email, 
        password 
      });
      if (!result.success) {
        toast({
          title: 'Validation Error',
          description: result.error.issues[0].message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(email, password, { full_name: fullName });
      if (error) {
        toast({
          title: 'Registration failed',
          description: error.message || 'Failed to create account. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email to confirm your account.',
        });
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 animate-pulse">
            <School className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <School className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SchoolMS</h1>
          <p className="text-muted-foreground">School Results Management System</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="p-6">
                <CardHeader className="text-center p-0 mb-6">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to access your dashboard
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="p-6">
                <CardHeader className="text-center p-0 mb-6">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Register for a new account
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Info section */}
            <div className="p-6 pt-0">
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-info mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Getting Started:</p>
                    <div className="space-y-1">
                      <p>• Create an account to get started</p>
                      <p>• Contact your administrator for role assignment</p>
                      <p>• Check your email after registration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;