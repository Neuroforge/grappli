import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const user = searchParams.get('user');

        if (error) {
          toast.error(error || 'Authentication failed');
          navigate('/login');
          return;
        }

        if (token && user) {
          // Store the token and user data
          localStorage.setItem('token', token);

          // Parse user data if it's a string
          const userData = typeof user === 'string' ? JSON.parse(user) : user;

          // Update auth context
          setToken(token);
          setUser(userData);

          toast.success('Successfully signed in!');
          navigate('/');
        } else {
          toast.error('Authentication failed - missing token or user data');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setToken, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing authentication...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your sign-in process.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
