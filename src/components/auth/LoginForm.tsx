import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SignUpForm } from './SignUpForm';
import {Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/images/wecare.png';
import superdollLogo from '../../assets/images/stm_logo.png';

export function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  // Load remembered credentials on component mount
  React.useEffect(() => {
    const rememberedCredentials = localStorage.getItem('helpdesk_remembered_credentials');
    if (rememberedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(rememberedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem('helpdesk_remembered_credentials', JSON.stringify({
        email,
        password
      }));
    } else {
      localStorage.removeItem('helpdesk_remembered_credentials');
    }

    // Use the signIn function from AuthContext
    signIn(email, password).then(({ success, error: authError }) => {
      if (!success) {
        setError(authError || 'Invalid email or password. Please check your credentials and try again.');
        // Clear remembered credentials if login fails
        if (rememberMe) {
          localStorage.removeItem('helpdesk_remembered_credentials');
          setRememberMe(false);
        }
      }
      // Login success is handled by App.tsx routing via auth state change
    }).catch((error) => {
      console.error('Login error:', error);
      setError(`Login failed: ${error.message || 'Please contact your administrator.'}`);
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Golden/Yellow Branding Section */}
      <div className="flex-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        {/* Company Logo/Branding */}
        <div className="relative z-10 text-center">
          <div className="bg-gradient-to-r from-amber-450 to-yellow-500 p-8 rectangle">
          <div className="relative z-10 text-center">
          <div className=" ">
          <div className="flex items-center justify-center mb-4">
  <img src={superdollLogo} alt="SUPERDOLL Logo" className="h-20 w-auto" />
</div>

            <div className="h-1 bg-yellow-300 rounded-full"></div>
          </div>
          
       
        </div>
          </div>
          
          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Technical Support System
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Streamline your IT support requests and get quick resolutions for all your technical issues
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to IT Help Desk System
            </h2>
            <p className="text-gray-600">
              Please sign-in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your.email@superdoll.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember Me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-lg"
            >
              Sign in
            </button>
          </form>

          {/* Company Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">SuperDoll IT Support</h3>
            <p className="text-xs text-gray-600 mb-2">
              Use your SuperDoll company credentials to access the IT support system.
            </p>
            <p className="text-xs text-gray-500">
              Don't have an account? Contact your administrator to create one for you.
            </p>
          </div>

          {/* Footer Logo */}
          <div className="mt-8 flex justify-center items-center">
  <div
    className="flex justify-center items-center"
    style={{ width: '100px', height: '100px' }}
  >
    <img src={logo} alt="SUPERDOLL Logo" className="h-16 w-auto" />
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
