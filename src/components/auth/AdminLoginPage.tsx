import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Mail, 
  Lock, 
  AlertCircle, 
  School, 
  Settings, 
  Users, 
  Database,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/lib/validations';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { signIn, isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default to admin dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated and user is admin
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      if (user.role === 'administrator' || user.role === 'head_teacher') {
        console.log('Admin user authenticated, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        // Non-admin users should be redirected to regular login
        toast({
          title: 'Access Denied',
          description: 'This portal is restricted to administrators only.',
          variant: 'destructive',
        });
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate, from, toast]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
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

      console.log('Attempting admin sign in...');
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Admin sign in error:', error);
        setLoginAttempts(prev => prev + 1);
        
        toast({
          title: 'Login Failed',
          description: error.message || 'Invalid administrator credentials. Please verify your access rights.',
          variant: 'destructive',
        });
        setIsLoading(false);
      } else {
        console.log('Admin sign in successful');
        setLoginAttempts(0);
        toast({
          title: 'Welcome, Administrator!',
          description: 'Successfully logged into the admin portal.',
        });
        // Don't set loading to false here - let the auth context handle it
      }
    } catch (error) {
      console.error('Unexpected error during admin sign in:', error);
      setLoginAttempts(prev => prev + 1);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please contact system support.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-background to-slate-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-background to-slate-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4 shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground">SchoolMS Administrative Access</p>
          <Badge variant="secondary" className="mt-2">
            <Database className="h-3 w-3 mr-1" />
            Secure Gateway
          </Badge>
        </div>

        <Card className="shadow-xl border-blue-200/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Administrator Login
            </CardTitle>
            <CardDescription>
              Enter your administrator credentials to access the system management portal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Security Notice */}
            <Alert className="border-blue-200 bg-blue-50/50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-700">
                This portal is restricted to authorized administrators only. All access is logged and monitored.
              </AlertDescription>
            </Alert>

            {/* Login Form */}
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm font-medium">
                  Administrator Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-blue-200/50 focus:border-blue-400"
                    required
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  Administrator Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-blue-200/50 focus:border-blue-400"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Attempts Warning */}
              {loginAttempts > 0 && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Failed attempts: {loginAttempts}/5. Account will be temporarily locked after 5 failed attempts.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5" 
                disabled={isLoading || loginAttempts >= 5}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </form>

            {/* Quick Admin Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Admin Portal Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <School className="h-3 w-3" />
                  School Management
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  User Administration
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  System Configuration
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Data Management
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Need help? Contact{' '}
                <a href="mailto:support@schoolms.edu" className="text-blue-600 hover:underline">
                  Technical Support
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                SchoolMS v1.0 • Secure Admin Gateway
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;