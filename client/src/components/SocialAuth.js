import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Twitter, Instagram } from 'lucide-react';

const SocialAuth = ({ mode = 'login' }) => {
  const { loginWithGoogle, loginWithTwitter, loginWithInstagram } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleTwitterAuth = async () => {
    try {
      await loginWithTwitter();
      toast.success('Successfully signed in with Twitter!');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Twitter');
    }
  };

  const handleInstagramAuth = async () => {
    try {
      await loginWithInstagram();
      toast.success('Successfully signed in with Instagram!');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Instagram');
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={handleGoogleAuth}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Mail className="w-5 h-5 mr-3 text-red-500" />
          <span className="font-medium">
            {mode === 'login' ? 'Sign in' : 'Sign up'} with Google
          </span>
        </button>

        <button
          onClick={handleTwitterAuth}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Twitter className="w-5 h-5 mr-3 text-blue-400" />
          <span className="font-medium">
            {mode === 'login' ? 'Sign in' : 'Sign up'} with Twitter
          </span>
        </button>

        <button
          onClick={handleInstagramAuth}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Instagram className="w-5 h-5 mr-3 text-pink-500" />
          <span className="font-medium">
            {mode === 'login' ? 'Sign in' : 'Sign up'} with Instagram
          </span>
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default SocialAuth;
