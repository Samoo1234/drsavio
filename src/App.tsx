import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import HeroAdmin from './pages/admin/HeroAdmin';
import AboutAdmin from './pages/admin/AboutAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';
import ContactInfoAdmin from './pages/admin/ContactInfoAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<Login session={session} />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute session={session}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute session={session}>
          <ServicesAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/testimonials" element={
        <ProtectedRoute session={session}>
          <TestimonialsAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/hero" element={
        <ProtectedRoute session={session}>
          <HeroAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/about" element={
        <ProtectedRoute session={session}>
          <AboutAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/contacts" element={
        <ProtectedRoute session={session}>
          <ContactsAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/contact-info" element={
        <ProtectedRoute session={session}>
          <ContactInfoAdmin />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;