import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Edit,
  Save,
  X,
  Award,
  Calendar,
  Coffee,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updateProfileMutation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      beltColor: user?.beltRank?.color || 'white',
      beltStripe: user?.beltRank?.stripe || 0,
    },
  });

  const beltColors = [
    { value: 'white', label: 'White Belt', color: 'bg-white-belt' },
    { value: 'blue', label: 'Blue Belt', color: 'bg-blue-belt' },
    { value: 'purple', label: 'Purple Belt', color: 'bg-purple-belt' },
    { value: 'brown', label: 'Brown Belt', color: 'bg-brown-belt' },
    { value: 'black', label: 'Black Belt', color: 'bg-black-belt' },
  ];

  const getBeltDisplay = beltRank => {
    if (!beltRank) return '';
    const color =
      beltRank.color.charAt(0).toUpperCase() + beltRank.color.slice(1);
    const stripeText =
      beltRank.stripe > 0
        ? ` (${beltRank.stripe} stripe${beltRank.stripe > 1 ? 's' : ''})`
        : '';
    return `${color} Belt${stripeText}`;
  };

  const onSubmit = data => {
    const profileData = {
      ...data,
      beltRank: {
        color: data.beltColor,
        stripe: parseInt(data.beltStripe),
      },
    };
    delete profileData.beltColor;
    delete profileData.beltStripe;

    updateProfile(profileData);
    setIsEditing(false);
    reset(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      beltColor: user?.beltRank?.color || 'white',
      beltStripe: user?.beltRank?.stripe || 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/settings"
            className="btn-outline flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline flex items-center space-x-2"
          >
            {isEditing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  disabled={!isEditing}
                  rows={4}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Belt Color
                  </label>
                  <select
                    {...register('beltColor')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  >
                    {beltColors.map(belt => (
                      <option key={belt.value} value={belt.value}>
                        {belt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stripes
                  </label>
                  <select
                    {...register('beltStripe')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  >
                    {[0, 1, 2, 3, 4].map(stripe => (
                      <option key={stripe} value={stripe}>
                        {stripe} {stripe === 1 ? 'stripe' : 'stripes'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {updateProfileMutation.isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Username
                </span>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Member Since
                </span>
                <p className="text-gray-900">
                  {new Date(user?.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="card">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600 mb-3">@{user?.username}</p>
              {user?.beltRank && (
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full belt-${user.beltRank.color}`}
                >
                  {getBeltDisplay(user.beltRank)}
                </span>
              )}
              {user?.bio && (
                <p className="text-gray-600 mt-4 text-sm">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Contribution Points
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    {user?.contributionPoints || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(user?.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Support the Project</h3>
            <p className="text-gray-600 text-sm mb-4">
              Help us keep this platform free and continue improving it for the
              BJJ community.
            </p>
            <a
              href="https://www.buymeacoffee.com/jiujitsuknowledge"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
