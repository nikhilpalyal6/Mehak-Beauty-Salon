import React, { useState, useEffect } from 'react'
import { Search, Eye, Trash2, CheckCircle, PhoneCall, Clock, Mail, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import enquiriesService from '../../services/enquiriesService'
import './AdminEnquiries.css'

const STATUS_FILTERS = ['All', 'New', 'Contacted', 'Completed']

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [error, setError] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingEnquiry, setViewingEnquiry] = useState(null)

  useEffect(() => {
    loadEnquiries()
  }, [])

  const loadEnquiries = async () => {
    try {
      setLoading(true)
      const data = await enquiriesService.getAll()
      setEnquiries(data)
    } catch (err) {
      console.error('Failed to load enquiries:', err)
      setError('Failed to load enquiries.')
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleViewDetails = (enquiry) => {
    setViewingEnquiry(enquiry)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setViewingEnquiry(null)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await enquiriesService.update(id, { status: newStatus })
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
      if (viewingEnquiry && viewingEnquiry.id === id) {
        setViewingEnquiry(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      try {
        await enquiriesService.remove(id)
        setEnquiries(prev => prev.filter(e => e.id !== id))
        handleCloseModal()
      } catch (err) {
        console.error('Failed to delete enquiry:', err)
        alert('Failed to delete enquiry.')
      }
    }
  }

  // Filtering
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      enq.phone.includes(searchQuery) ||
      enq.service.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'All' || enq.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Helper for status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'New': return <Clock size={14} />
      case 'Contacted': return <PhoneCall size={14} />
      case 'Completed': return <CheckCircle size={14} />
      default: return null
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Enquiries Manager</h2>
          <p>Track customer booking requests and messages.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters-bar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, phone or service..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          {STATUS_FILTERS.map(status => (
            <button 
              key={status}
              className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="empty-state">Loading enquiries...</div>
        ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service Interested</th>
              <th>Date</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map(enq => (
                <tr key={enq.id} className={enq.status === 'New' ? 'new-enquiry-row' : ''}>
                  <td>
                    <div className="customer-cell">
                      <span className="font-medium">{enq.customerName}</span>
                      <span className="customer-phone">{enq.phone}</span>
                    </div>
                  </td>
                  <td><span className="category-badge">{enq.service}</span></td>
                  <td>{enq.date}</td>
                  <td>
                    <span className={`enq-status-badge ${enq.status.toLowerCase()}`}>
                      {getStatusIcon(enq.status)}
                      {enq.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button className="action-btn edit" onClick={() => handleViewDetails(enq)} title="View Details">
                      <Eye size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(enq.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  <Mail size={48} opacity={0.2} style={{margin: '0 auto 1rem', display: 'block'}} />
                  No enquiries found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {isModalOpen && viewingEnquiry && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal enquiry-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="admin-modal-header">
                <h3>Enquiry Details</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="enquiry-modal-body">
                <div className="enq-detail-grid">
                  <div className="enq-detail-item">
                    <span className="label">Customer Name</span>
                    <span className="value font-medium">{viewingEnquiry.customerName}</span>
                  </div>
                  <div className="enq-detail-item">
                    <span className="label">Phone Number</span>
                    <span className="value">{viewingEnquiry.phone}</span>
                  </div>
                  <div className="enq-detail-item">
                    <span className="label">Service Interested</span>
                    <span className="value"><span className="category-badge">{viewingEnquiry.service}</span></span>
                  </div>
                  <div className="enq-detail-item">
                    <span className="label">Date Received</span>
                    <span className="value">{viewingEnquiry.date}</span>
                  </div>
                  <div className="enq-detail-item full-width">
                    <span className="label">Message</span>
                    <div className="message-box">
                      {viewingEnquiry.message}
                    </div>
                  </div>
                </div>

                <div className="enq-status-section">
                  <span className="label">Current Status:</span>
                  <span className={`enq-status-badge large ${viewingEnquiry.status.toLowerCase()}`}>
                    {getStatusIcon(viewingEnquiry.status)}
                    {viewingEnquiry.status}
                  </span>
                </div>
              </div>

              <div className="admin-modal-footer enq-modal-footer">
                <div className="quick-actions-left">
                  {viewingEnquiry.status !== 'Contacted' && (
                    <button 
                      className="admin-btn-secondary enq-action-btn contacted-btn" 
                      onClick={() => updateStatus(viewingEnquiry.id, 'Contacted')}
                    >
                      <PhoneCall size={16} /> Mark as Contacted
                    </button>
                  )}
                  {viewingEnquiry.status !== 'Completed' && (
                    <button 
                      className="admin-btn-secondary enq-action-btn completed-btn" 
                      onClick={() => updateStatus(viewingEnquiry.id, 'Completed')}
                    >
                      <CheckCircle size={16} /> Mark as Completed
                    </button>
                  )}
                </div>
                
                <button 
                  className="admin-btn-secondary delete-enq-btn" 
                  onClick={() => handleDelete(viewingEnquiry.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminEnquiries
