/**
 * Jiujitsu Knowledge Platform - Layout Component
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2025 Neuroforge
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Search,
  Network,
  User,
  LogIn,
  LogOut,
  Coffee,
  Menu,
  X,
  TrendingUp,
  BookOpen,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Graph Explorer', href: '/explorer', icon: Network },
    { name: 'Principles', href: '/principles', icon: BookOpen },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Top Voted', href: '/top-voted', icon: TrendingUp },
  ];

  const isActive = path => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 touch-target">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JJ</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Jiujitsu Knowledge
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors touch-target ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.isAdmin && (
                    <Link
                      to="/moderation"
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 touch-target"
                      title="Moderation Dashboard"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Moderation</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 touch-target"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user?.username}
                    </span>
                    {user?.beltRank && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full belt-${user.beltRank.color}`}
                      >
                        {user.beltRank.color.charAt(0).toUpperCase() +
                          user.beltRank.color.slice(1)}
                        {user.beltRank.stripe > 0 &&
                          ` (${user.beltRank.stripe})`}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 touch-target"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 touch-target"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 touch-target"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-nav-item rounded-md ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-item rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                      {user?.beltRank && (
                        <span
                          className={`ml-auto px-2 py-1 text-xs font-medium rounded-full belt-${user.beltRank.color}`}
                        >
                          {user.beltRank.color.charAt(0).toUpperCase() +
                            user.beltRank.color.slice(1)}
                          {user.beltRank.stripe > 0 &&
                            ` (${user.beltRank.stripe})`}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="mobile-nav-item rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-item rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mobile-px mobile-py">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto mobile-px py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">JJ</span>
              </div>
              <span className="text-gray-600 mobile-text-sm">
                Jiujitsu Knowledge
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <span className="mobile-text-sm">
                © 2024 Jiujitsu Knowledge. All rights reserved.
              </span>
              <a
                href="https://www.buymeacoffee.com/jiujitsuknowledge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors touch-target"
              >
                <Coffee className="w-4 h-4" />
                <span className="mobile-text-sm">Buy me a coffee</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
