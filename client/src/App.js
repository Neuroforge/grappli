/**
 * Jiujitsu Knowledge Platform - Client
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
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GraphProvider } from './contexts/GraphContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GraphExplorer from './pages/GraphExplorer';
import GraphExplorer3D from './pages/GraphExplorer3D';
import PositionDetail from './pages/PositionDetail';
import TechniqueDetail from './pages/TechniqueDetail';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import Principles from './pages/Principles';
import Search from './pages/Search';
import TopVoted from './pages/TopVoted';
import ModerationDashboard from './pages/ModerationDashboard';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <GraphProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/explorer" element={<GraphExplorer />} />
              <Route path="/explorer-3d" element={<GraphExplorer3D />} />
              <Route path="/position/:id" element={<PositionDetail />} />
              <Route path="/technique/:id" element={<TechniqueDetail />} />
              <Route path="/principles" element={<Principles />} />
              <Route path="/search" element={<Search />} />
              <Route path="/top-voted" element={<TopVoted />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderation"
                element={
                  <ProtectedRoute>
                    <ModerationDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </ThemeProvider>
      </GraphProvider>
    </AuthProvider>
  );
}

export default App;
