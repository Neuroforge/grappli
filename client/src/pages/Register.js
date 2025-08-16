import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import SocialAuth from '../components/SocialAuth';

const Register = () => {
  const {
    register: registerUser,
    isAuthenticated,
    registerMutation,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const beltColors = [
    { value: 'white', label: 'White Belt', color: 'bg-white-belt' },
    { value: 'blue', label: 'Blue Belt', color: 'bg-blue-belt' },
    { value: 'purple', label: 'Purple Belt', color: 'bg-purple-belt' },
    { value: 'brown', label: 'Brown Belt', color: 'bg-brown-belt' },
    { value: 'black', label: 'Black Belt', color: 'bg-black-belt' },
  ];

  const onSubmit = data => {
    const userData = {
      ...data,
      beltRank: {
        color: data.beltColor || 'white',
        stripe: parseInt(data.beltStripe) || 0,
      },
    };
    delete userData.beltColor;
    delete userData.beltStripe;
    registerUser(userData);
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center mobile-py mobile-px">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 mobile-text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 mobile-text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 mobile-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="mobile-space-y">
            {/* Username */}
            <div className="mobile-form-group">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 30,
                    message: 'Username must be less than 30 characters',
                  },
                })}
                className={`input-field input-field-mobile mt-1 ${
                  errors.username ? 'border-red-500' : ''
                }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mobile-form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`input-field input-field-mobile mt-1 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="mobile-form-group">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                className={`input-field input-field-mobile mt-1 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="mobile-form-group">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                className={`input-field input-field-mobile mt-1 ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mobile-form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`input-field input-field-mobile pr-10 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center touch-target"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mobile-form-group">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match',
                  })}
                  className={`input-field input-field-mobile pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center touch-target"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Belt Rank */}
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belt Rank
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {beltColors.map(belt => (
                  <label
                    key={belt.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={belt.value}
                      {...register('beltColor')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-sm">{belt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Belt Stripes */}
            <div className="mobile-form-group">
              <label
                htmlFor="beltStripe"
                className="block text-sm font-medium text-gray-700"
              >
                Belt Stripes
              </label>
              <select
                id="beltStripe"
                {...register('beltStripe')}
                className="input-field input-field-mobile mt-1"
              >
                <option value="0">0 Stripes</option>
                <option value="1">1 Stripe</option>
                <option value="2">2 Stripes</option>
                <option value="3">3 Stripes</option>
                <option value="4">4 Stripes</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isLoading}
              className="btn-primary btn-mobile w-full flex justify-center py-3 text-base font-medium"
            >
              {registerMutation.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Create account</span>
                </div>
              )}
            </button>
          </div>

          {registerMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">
                {registerMutation.error?.response?.data?.error ||
                  'An error occurred during registration'}
              </p>
            </div>
          )}
        </form>

        {/* Social Authentication */}
        <SocialAuth mode="register" />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-mobile"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
