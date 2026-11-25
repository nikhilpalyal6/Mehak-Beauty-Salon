import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import settingsService from '../../services/settingsService'
import { 
  LayoutDashboard, 
  Scissors, 
  BookOpen, 
  Image as ImageIcon, 
  Tag, 
  MessageSquare, 
  Globe, 
  Mail, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import logo from '../../assets/logo/logo2.png'
import './AdminLayout.css'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState('Admin')
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const settings = await settingsService.getById('main')
        if (settings?.admin?.adminName) {
          setAdminName(settings.admin.adminName)
        }
      } catch (error) {
        console.error('Failed to load admin settings:', error)
      }
    }
    loadAdminData()
  }, [location.pathname]) // Re-load when navigating to potentially catch updates

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const navLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: Scissors, label: 'Services' },
    { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { path: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
    { path: '/admin/offers', icon: Tag, label: 'Offers' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admin/content', icon: Globe, label: 'Website Content' },
    { path: '/admin/enquiries', icon: Mail, label: 'Enquiries' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ]

  // Determine current page title
  const currentNav = navLinks.find(link => location.pathname.startsWith(link.path))
  const pageTitle = currentNav ? currentNav.label : 'Dashboard'

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src={logo} alt="Mehak Salon" className="admin-brand-logo" />
          <button 
            className="mobile-sidebar-close" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="admin-nav">
          {navLinks.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1>{pageTitle}</h1>
          </div>
          
          <div className="topbar-right">
            <div className="admin-profile">
              <div className="admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
              <span>{adminName}</span>
            </div>
          </div>
        </header>

        {/* Content Route Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
