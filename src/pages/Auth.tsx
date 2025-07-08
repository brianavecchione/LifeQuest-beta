import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Adventure Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/lovable-uploads/5e50c92f-4f13-42d9-b22c-d8696342579e.png)`,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Promotional Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          {/* Logo & Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-3xl">⚔️</span>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  LifeQuest
                </h1>
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Adventure<br />
              Awaits
            </h2>
            
            <p className="text-xl text-slate-300 mb-12">
              Join the quest to level up your life!
            </p>
            
            {/* Feature List */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-lg text-white">Set daily quests to stay on track</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <span className="text-lg text-white">Earn XP and badges for your progress</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <span className="text-lg text-white">Build habits with streak tracking</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-lg text-white">Redeem your achievements for real-life rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md flex flex-col justify-center px-8 lg:px-12">
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
                        placeholder="adventurer@questmaster.com"
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
                        placeholder="adventurer@questmaster.com"
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview as Guest Button - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20">
        <Button
          variant="outline"
          className="border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white backdrop-blur-sm"
          onClick={() => navigate('/')}
        >
          Preview as Guest
        </Button>
      </div>
    </div>
  );
};

export default Auth;