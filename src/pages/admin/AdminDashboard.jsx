import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, BookOpen, ImageIcon, Tag, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import settingsService from '../../services/settingsService'
import regularServicesService from '../../services/regularServicesService'
import coursesService from '../../services/coursesService'
import galleryService from '../../services/galleryService'
import offersService from '../../services/offersService'
import enquiriesService from '../../services/enquiriesService'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [adminName, setAdminName] = useState('Admin')
  const [dashboardData, setDashboardData] = useState({
    totalServices: 0,
    totalCourses: 0,
    galleryImages: 0,
    activeOffers: 0,
    newEnquiries: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const [
          settings,
          services,
          courses,
          gallery,
          offers,
          enquiries
        ] = await Promise.all([
          settingsService.getById('main').catch(() => null),
          regularServicesService.getAll().catch(() => []),
          coursesService.getAll().catch(() => []),
          galleryService.getAll().catch(() => []),
          offersService.getAll().catch(() => []),
          enquiriesService.getAll().catch(() => [])
        ])

        if (settings?.admin?.adminName) {
          setAdminName(settings.admin.adminName)
        }

        const activeOffersCount = offers.filter(o => o.status === 'Active').length
        const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length

        setDashboardData({
          totalServices: services.length,
          totalCourses: courses.length,
          galleryImages: gallery.length,
          activeOffers: activeOffersCount,
          newEnquiries: newEnquiriesCount
        })

        // Sort enquiries by date descending to show as recent activity
        const sortedEnquiries = [...enquiries]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5) // Show top 5 recent enquiries
        setRecentActivities(sortedEnquiries)

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const stats = [
    { title: 'Total Services', value: dashboardData.totalServices.toString(), icon: Scissors, color: '#f3a683' },
    { title: 'Total Courses', value: dashboardData.totalCourses.toString(), icon: BookOpen, color: '#f8a5c2' },
    { title: 'Gallery Images', value: dashboardData.galleryImages.toString(), icon: ImageIcon, color: '#778beb' },
    { title: 'Active Offers', value: dashboardData.activeOffers.toString(), icon: Tag, color: '#e77f67' },
    { title: 'New Enquiries', value: dashboardData.newEnquiries.toString(), icon: MessageSquare, color: '#cf6a87' }
  ]

  const quickActions = [
    { label: 'Manage Services', icon: Scissors, path: '/admin/services' },
    { label: 'Manage Courses', icon: BookOpen, path: '/admin/courses' },
    { label: 'Update Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { label: 'View Enquiries', icon: MessageSquare, path: '/admin/enquiries' }
  ]

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Welcome Back, {adminName}</h2>
        <p>Here is what's happening at Mehak Salon & Spa today.</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="stat-card-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-card-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-sections">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                className="quick-action-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(action.path)}
              >
                <action.icon size={20} />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="dashboard-section">
          <h3>Recent Activity</h3>
          <div className="activity-card">
            {recentActivities.length > 0 ? (
              <div className="recent-activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item" style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{activity.customerName}</h4>
                      <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>New enquiry for {activity.service || 'a service'}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                ))}
                <button 
                  style={{ width: '100%', padding: '15px', background: 'none', border: 'none', color: '#c6a16e', cursor: 'pointer', fontWeight: '500' }}
                  onClick={() => navigate('/admin/enquiries')}
                >
                  View All Enquiries
                </button>
              </div>
            ) : (
              <div className="activity-empty" style={{ padding: '40px', textAlign: 'center' }}>
                <MessageSquare size={32} opacity={0.2} style={{ margin: '0 auto 10px auto', display: 'block' }} />
                <p>No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
