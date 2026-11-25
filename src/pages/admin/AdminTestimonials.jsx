import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Star, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import testimonialsService from '../../services/testimonialsService'
import ImageUploader from '../../components/admin/ImageUploader'
import './AdminTestimonials.css'

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    serviceUsed: '',
    rating: 5,
    text: '',
    imageUrl: '',
    imagePublicId: '',
    status: 'Pending',
    featured: false
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await testimonialsService.getAll()
      setTestimonials(data)
    } catch (err) {
      console.error('Failed to load testimonials:', err)
      setError('Failed to load testimonials.')
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review)
      setFormData(review)
    } else {
      setEditingReview(null)
      setFormData({ 
        customerName: '', serviceUsed: '', rating: 5, text: '', 
        imageUrl: '', imagePublicId: '', status: 'Pending', featured: false 
      })
    }
    setError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingReview(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? Number(value) : value)
    }))
  }

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData.imageUrl || '',
      imagePublicId: imageData.publicId || ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      if (editingReview) {
        await testimonialsService.update(editingReview.id, formData)
        setTestimonials(prev => prev.map(t => t.id === editingReview.id ? { ...formData, id: t.id } : t))
      } else {
        const newTestimonial = await testimonialsService.create(formData)
        setTestimonials(prev => [...prev, newTestimonial])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving testimonial:', err)
      setError('Failed to save testimonial.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialsService.remove(id)
        setTestimonials(prev => prev.filter(t => t.id !== id))
      } catch (err) {
        console.error('Failed to delete testimonial:', err)
        alert('Failed to delete testimonial.')
      }
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await testimonialsService.update(id, { status: newStatus })
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status.')
    }
  }

  // Filtering
  const filteredTestimonials = testimonials.filter(t => 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? 'star-filled' : 'star-empty'} 
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Testimonials Manager</h2>
          <p>Manage customer reviews, moderate feedback, and highlight featured testimonials.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters-bar">
        <div className="search-wrapper full-width-search">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by customer name or review content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="admin-testimonials-grid">
        {loading ? (
          <div className="empty-state-card">Loading testimonials...</div>
        ) : filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((review, index) => (
            <motion.div 
              key={review.id}
              className={`admin-review-card ${review.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="review-card-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.imageUrl ? (
                      <img src={review.imageUrl} alt={review.customerName} />
                    ) : (
                      <User size={24} color="var(--espresso)" />
                    )}
                  </div>
                  <div>
                    <h4 className="reviewer-name">{review.customerName}</h4>
                    <span className="review-service">{review.serviceUsed}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="review-card-body">
                <p>"{review.text}"</p>
              </div>
              
              <div className="review-card-footer">
                <div className="status-controls">
                  <span className={`status-badge ${review.status.toLowerCase()}`}>
                    {review.status}
                  </span>
                  
                  {review.status === 'Pending' && (
                    <div className="moderation-btns">
                      <button className="mod-btn approve" onClick={() => updateStatus(review.id, 'Approved')}>Approve</button>
                      <button className="mod-btn reject" onClick={() => updateStatus(review.id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </div>

                <div className="card-actions-right">
                  <button className="action-btn edit" onClick={() => handleOpenModal(review)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(review.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state-card">
            <Star size={48} opacity={0.2} />
            <p>No testimonials found.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="admin-modal-header">
                <h3>{editingReview ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                {error && <div className="admin-login-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input 
                      type="text" 
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Used</label>
                    <input 
                      type="text" 
                      name="serviceUsed"
                      value={formData.serviceUsed}
                      onChange={handleInputChange}
                      placeholder="e.g. Bridal Makeup"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating (1-5)</label>
                    <select name="rating" value={formData.rating} onChange={handleInputChange}>
                      {[5,4,3,2,1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    existingImageUrl={formData.imageUrl}
                    existingPublicId={formData.imagePublicId}
                    label="Customer Avatar (Optional)"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Review Text</label>
                  <textarea 
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Customer's feedback..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      Feature on Home Page
                    </label>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={handleCloseModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : (editingReview ? 'Save Changes' : 'Add Testimonial')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminTestimonials
