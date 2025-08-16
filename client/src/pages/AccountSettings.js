import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Shield,
  Palette,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountSettings = () => {
  const { user, updateProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      beltColor: user?.beltColor || 'white',
      beltStripe: user?.beltStripe || 0,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const beltOptions = [
    { value: 'white', label: 'White Belt', color: 'bg-white-belt' },
    { value: 'blue', label: 'Blue Belt', color: 'bg-blue-belt' },
    { value: 'purple', label: 'Purple Belt', color: 'bg-purple-belt' },
    { value: 'brown', label: 'Brown Belt', color: 'bg-brown-belt' },
    { value: 'black', label: 'Black Belt', color: 'bg-black-belt' },
  ];

  const stripeOptions = [
    { value: 0, label: 'No Stripes' },
    { value: 1, label: '1 Stripe' },
    { value: 2, label: '2 Stripes' },
    { value: 3, label: '3 Stripes' },
    { value: 4, label: '4 Stripes' },
  ];

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        beltColor: data.beltColor,
        beltStripe: data.beltStripe,
      };

      // Only include password fields if user wants to change password
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getBeltDisplay = beltRank => {
    if (!beltRank) return '';
    const color = beltRank === 'white' ? 'text-gray-900' : 'text-white';
    return color;
  };

  const getStripeDisplay = stripeCount => {
    if (!stripeCount) return '';
    return stripeCount === 1 ? 'stripe' : 'stripes';
  };

  return (
    <div className="max-w-4xl mx-auto mobile-space-y">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="mobile-text-2xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 mobile-text-sm">
              Manage your profile and preferences
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Information */}
        <section className="card card-mobile">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="mobile-text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                className={`input-field input-field-mobile ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                className={`input-field input-field-mobile ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="mobile-form-group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field input-field-mobile bg-gray-50"
                placeholder="Enter your email"
                disabled
              />
              <p className="text-gray-500 text-sm mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="mobile-form-group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="input-field input-field-mobile"
                placeholder="Tell us about your BJJ journey..."
              />
            </div>
          </div>
        </section>

        {/* Belt Information */}
        <section className="card card-mobile">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-primary-600" />
            <h2 className="mobile-text-xl font-semibold text-gray-900">
              Belt & Theme
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belt Color
              </label>
              <select
                {...register('beltColor')}
                className="input-field input-field-mobile"
              >
                {beltOptions.map(belt => (
                  <option key={belt.value} value={belt.value}>
                    {belt.label}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 text-sm mt-1">
                Your belt color determines the app&apos;s theme
              </p>
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belt Stripes
              </label>
              <select
                {...register('beltStripe', { valueAsNumber: true })}
                className="input-field input-field-mobile"
              >
                {stripeOptions.map(stripe => (
                  <option key={stripe.value} value={stripe.value}>
                    {stripe.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Belt Display */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full ${watch('beltColor')}-belt flex items-center justify-center`}
                >
                  <span
                    className={`text-sm font-bold ${getBeltDisplay(watch('beltColor'))}`}
                  >
                    {watch('beltStripe')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {
                      beltOptions.find(b => b.value === watch('beltColor'))
                        ?.label
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {watch('beltStripe')}{' '}
                    {getStripeDisplay(watch('beltStripe'))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Password Change */}
        <section className="card card-mobile">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="mobile-text-xl font-semibold text-gray-900">
              Change Password
            </h2>
          </div>

          <div className="space-y-4">
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                  className="input-field input-field-mobile pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                {...register('newPassword', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`input-field input-field-mobile ${
                  errors.newPassword ? 'border-red-500' : ''
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  validate: value =>
                    !watch('newPassword') ||
                    value === watch('newPassword') ||
                    'Passwords do not match',
                })}
                className={`input-field input-field-mobile ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary btn-mobile flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
