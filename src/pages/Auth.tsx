import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Target, Zap, Trophy, ShoppingBag, Palette, Sword, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { toast } from 'sonner';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    displayName: '',
    confirmPassword: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading } = useAuth();
  const { enableGuestMode } = useGuest();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
    
    // Add landing-page class to body for proper spacing
    document.body.classList.add('landing-page');
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, [user, loading, navigate]);

  // Check for reset confirmation
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      toast.success('Password reset email sent! Check your inbox and follow the instructions.');
    }
  }, [searchParams]);
  
  // Handle hash navigation for anchor links
  useEffect(() => {
    // Check if location has a hash
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Get CSS variables for navbar offset
        const navbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').trim();
        const navbarOffset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-top-offset').trim();
        
        // Calculate scroll position with offset
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - (parseFloat(navbarHeight) + parseFloat(navbarOffset) + 16);
        
        // Use a slight delay to ensure the page is fully loaded
        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location.hash]);

  // Show loading state if auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚔️</div>
          <p className="text-white text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back, adventurer!');
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(
      signupData.email, 
      signupData.password, 
      signupData.displayName || 'Adventurer'
    );
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account!');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
    // Don't set loading to false here since OAuth will redirect
  };

  const handleGuestPreview = () => {
    enableGuestMode();
    toast.success('Welcome to your preview adventure!');
    navigate('/');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsResetLoading(true);
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      toast.error(error.message || 'Failed to send reset email');
    } else {
      toast.success('Password reset email sent! Check your inbox.');
      setShowResetModal(false);
      setResetEmail('');
    }
    
    setIsResetLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Adventure Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/lovable-uploads/68f36d26-b4e4-41b2-8f4f-f740c275bd38.png)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900/60 backdrop-blur-[1px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-8">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
          {/* Left Side - Promotional Content */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl lg:pr-8 xl:pr-16">
            {/* Fantasy Scroll with Hero Content */}
            <div className="mb-8 lg:mb-12 relative">
              {/* Golden Glow Background */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-yellow-500/40 to-amber-600/30 rounded-3xl blur-xl scale-110 animate-pulse"
                style={{ filter: 'blur(20px)' }}
              />
              
              {/* Scroll Background Container */}
              <div 
                className="relative bg-contain bg-center bg-no-repeat min-h-[800px] sm:min-h-[900px] lg:min-h-[1000px] flex items-center justify-center p-8 sm:p-12 lg:p-16"
                style={{
                  backgroundImage: `url(/lovable-uploads/08d4b1cc-0768-4a03-989d-cc4c6141baa2.png)`,
                  backgroundSize: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4))'
                }}
              >
                {/* Content within Scroll Boundaries */}
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl text-center px-6 sm:px-8 lg:px-12 animate-fade-in">
                  {/* Logo & Title */}
                  <div className="flex items-center justify-center gap-3 mb-5 lg:mb-6">
                    <div className="flex items-center gap-2" style={{ filter: 'drop-shadow(0 2px 6px rgba(80, 48, 28, 0.7)) drop-shadow(0 0 12px rgba(80, 48, 28, 0.5))' }}>
                      <img 
                        src="/lovable-uploads/8805b1c0-4806-4158-b6a4-d2d47464e096.png" 
                        alt="LifeQuest Logo" 
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(80, 48, 28, 0.6)) drop-shadow(0 0 8px rgba(80, 48, 28, 0.4))' }}
                      />
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 2px 6px rgba(80, 48, 28, 0.7)) drop-shadow(0 0 10px rgba(80, 48, 28, 0.5)) drop-shadow(0 0 6px rgba(251, 191, 36, 0.2))' }}>
                        LifeQuest
                      </h1>
                    </div>
                  </div>
                  
                  {/* Main Headline */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4 lg:mb-5 leading-tight" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                    Your Adventure<br />
                    Awaits
                  </h2>
                  
                  {/* Subheadline */}
                  <p className="text-sm sm:text-base lg:text-lg text-amber-800 mb-4 lg:mb-5 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    LifeQuest is a science-backed, gamified system that transforms your real-life goals into quests.
                  </p>
                  
                  {/* Call to Action */}
                  <h3 className="text-base sm:text-lg lg:text-xl text-amber-900 font-semibold mb-4 lg:mb-5" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                    Join the quest to level up your life!
                  </h3>
                  
                  {/* Feature List */}
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-amber-700/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-base sm:text-lg lg:text-xl">🎯</span>
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-amber-900 font-medium leading-snug" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Create daily quests and track your progress</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-amber-700/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-base sm:text-lg lg:text-xl">💰</span>
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-amber-900 font-medium leading-snug" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Earn XP, gold, and rewards to build momentum</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-amber-700/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-base sm:text-lg lg:text-xl">🔥</span>
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-amber-900 font-medium leading-snug" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Strengthen habits with streaks, milestones, and badges</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-amber-700/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-base sm:text-lg lg:text-xl">🏆</span>
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-amber-900 font-medium leading-snug" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Redeem your achievements for meaningful real-world rewards</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-amber-700/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-base sm:text-lg lg:text-xl">🧠</span>
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-amber-900 font-medium leading-snug" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Designed with behavioral science to support motivation, focus, and consistent follow-through</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div id="login" className="flex-1 flex flex-col justify-center max-w-md lg:pl-8 xl:pl-16 w-full">
            <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white text-center">
                Welcome, Adventurer
              </CardTitle>
              <CardDescription className="text-slate-400 text-center">
                Sign in to continue your quest or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Google Sign In Button */}
              <div className="mb-6">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 hover:text-white font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? 'Signing In...' : 'Continue with Google'}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Or continue with email</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="login" className="data-[state=active]:bg-amber-600">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-amber-600">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="adventurer@getlifequest.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoading ? 'Signing In...' : 'Begin Quest'}
                    </Button>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-4">
                      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            className="text-amber-400 hover:text-amber-300 text-sm p-0 h-auto"
                          >
                            Forgot Password?
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Reset Password</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Enter your email address and we'll send you a link to reset your password.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email" className="text-slate-300">Email</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="Enter your email address"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowResetModal(false)}
                                className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={isResetLoading}
                                className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                {isResetLoading ? 'Sending...' : 'Send Reset Email'}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-300">Display Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your adventurer name"
                        value={signupData.displayName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="adventurer@getlifequest.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a secure password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="text-slate-300">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isLoading ? 'Creating Account...' : 'Start Adventure'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* Guest Preview Section */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="text-center space-y-3">
                  <p className="text-slate-400 text-sm">
                    Not ready to commit? Try it first!
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-slate-500 bg-slate-700/30 text-slate-200 hover:bg-slate-600/50 hover:text-white hover:border-slate-400 transition-all duration-200"
                    onClick={handleGuestPreview}
                  >
                    🎮 Preview as Guest
                  </Button>
                  <p className="text-xs text-slate-500">
                    Experience the full app with sample data
                  </p>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ textShadow: '0 3px 6px rgba(0, 0, 0, 0.7)' }}>
              Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ textShadow: '0 3px 6px rgba(0, 0, 0, 0.7)' }}>
              Transform your daily routine into an epic adventure with our comprehensive suite of gamification tools
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-6xl">
              {/* Daily Quests */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl w-full max-w-sm sm:w-80">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Daily Quests</h3>
                <p className="text-slate-700">
                  Break big goals into bite-sized tasks. Build consistency by turning your to-do list into daily quests.
                </p>
              </div>

              {/* Focus Mode */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl w-full max-w-sm sm:w-80">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Focus Mode</h3>
                <p className="text-slate-700">
                  Pick your top 3–5 priorities each day to stay on track. Earn extra XP and gold for completing them.
                </p>
              </div>

              {/* Achievements */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl w-full max-w-sm sm:w-80">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Achievements</h3>
                <p className="text-slate-700">
                  Get rewarded for your effort. Earn streaks, badges, and milestones as you complete your quests.
                </p>
              </div>

              {/* Inventory & Gold Shop */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl w-full max-w-sm sm:w-80">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Inventory & Gold Shop</h3>
                <p className="text-slate-700">
                  Claim in-platform or real-world rewards using the gold you earn. Unlock streak protectors, XP boosts, profile frames, or create your own rewards.
                </p>
              </div>

              {/* Customization */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl w-full max-w-sm sm:w-80">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Customization</h3>
                <p className="text-slate-700">
                  Personalize your journey with custom backgrounds, themes, and avatars. Design your space to match your vibe.
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8" style={{ textShadow: '0 3px 6px rgba(0, 0, 0, 0.7)' }}>
              Coming Soon
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl justify-items-center">
                {/* Challenges */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl w-full max-w-sm">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Sword className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Challenges</h4>
                  <p className="text-slate-700">
                    Join limited-time challenges to compete with others, track progress, and unlock exclusive rewards.
                  </p>
                </div>

                {/* Parties */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl w-full max-w-sm">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Parties</h4>
                  <p className="text-slate-700">
                    Team up with friends to tackle quests together, keep each other accountable, and grow as a party.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;