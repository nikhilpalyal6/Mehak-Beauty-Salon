import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'

// Public Pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import Courses from './pages/Courses'
import About from './pages/About'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import CourseDetail from './pages/CourseDetail'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

import AdminServices from './pages/admin/AdminServices'
import AdminCourses from './pages/admin/AdminCourses'
import AdminGallery from './pages/admin/AdminGallery'

import AdminOffers from './pages/admin/AdminOffers'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminContent from './pages/admin/AdminContent'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminSettings from './pages/admin/AdminSettings'
import { AuthProvider } from './context/AuthContext'

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageView } from "./utils/analytics";

function AnalyticsTracker() {
   const location = useLocation();

   useEffect(() => {
      pageView();
   }, [location]);

   return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
