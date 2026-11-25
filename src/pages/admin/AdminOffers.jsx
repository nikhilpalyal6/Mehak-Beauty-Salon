import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Calendar, Tag, Percent } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import seasonalOffersService from '../../services/seasonalOffersService'
import './AdminOffers.css'

// AdminOffers is for Seasonal/Promotional offers ONLY
// Quick Offers, Packages, Hair Offers are managed from Admin Services Manager

const AdminOffers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  
  // Form State - Only for Seasonal offers
  const [formData, setFormData] = useState({
    title: '',
    offerPrice: '',
    originalPrice: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    featured: false
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    
    try {
      const unsub = seasonalOffersService.subscribeToAll((data) => {
        console.log('Raw seasonal offers data from Firestore:', data)
        console.log('Seasonal offer IDs:', data.map(o => o.id))
        setOffers(data || [])
        setLoading(false)
      }, (error) => {
        console.error('Firestore subscription error:', error)
        setError('Failed to load offers. Please refresh the page.')
        setLoading(false)
      })
      
      return () => unsub && unsub()
    } catch (err) {
      console.error('Error setting up offers subscription:', err)
      setError('Failed to connect to database.')
      setLoading(false)
    }
  }, [])

  // Handlers
  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({
        title: offer.title,
        offerPrice: offer.offerPrice,
        originalPrice: offer.originalPrice || '',
        description: offer.description || '',
        startDate: offer.startDate || '',
        endDate: offer.endDate || '',
        status: offer.status || 'Active',
        featured: offer.featured || false
      })
    } else {
      setEditingOffer(null)
      setFormData({ 
        title: '', offerPrice: '', originalPrice: '', 
        description: '', startDate: '', endDate: '', status: 'Active', featured: false 
      })
    }
    setError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOffer(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      // Basic validation
      if (!formData.title || !formData.offerPrice || !formData.description) {
        throw new Error('Please fill in all required fields.')
      }

      const offerData = {
        title: formData.title,
        offerPrice: Number(formData.offerPrice),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : '',
        description: formData.description,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        status: formData.status,
        featured: formData.featured,
        category: 'Seasonal'
      }

      // If editing, verify the document exists in current offers list
      if (editingOffer && editingOffer.id) {
        const offerExists = offers.find(o => o.id === editingOffer.id)
        if (!offerExists) {
          throw new Error('Offer not found. It may have been deleted. Please refresh the page.')
        }
      }

      // If marking as featured, first unfeature all other seasonal offers
      if (formData.featured) {
        const otherOffers = offers.filter(o => o.id !== editingOffer?.id && o.featured === true)
        for (const otherOffer of otherOffers) {
          await seasonalOffersService.update(otherOffer.id, { featured: false })
        }
      }

      if (editingOffer && editingOffer.id) {
        await seasonalOffersService.update(editingOffer.id, offerData)
        setSuccess('Offer updated successfully!')
      } else {
        await seasonalOffersService.create(offerData)
        setSuccess('Offer created successfully!')
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setIsModalOpen(false)
        setEditingOffer(null)
        setSuccess('')
      }, 1000)
    } catch (err) {
      console.error('Error saving offer:', err)
      setError(err.message || 'Failed to save offer.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    console.log('Deleting offer with ID:', id)
    
    // Verify the offer exists in current list
    const offerExists = offers.find(o => o.id === id)
    if (!offerExists) {
      setError('Offer not found. It may have already been deleted. Please refresh the page.')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await seasonalOffersService.remove(id)
      } catch (err) {
        console.error('Failed to delete offer:', err)
        setError('Failed to delete offer. Please try again.')
      }
    }
  }

  const toggleStatus = async (id) => {
    console.log('Toggling status for offer ID:', id)
    const offer = offers.find(o => o.id === id)
    if (!offer) {
      setError('Offer not found. It may have been deleted. Please refresh the page.')
      return
    }
    
    const newStatus = offer.status === 'Active' ? 'Inactive' : 'Active'
    console.log('Current offer:', offer, 'New status:', newStatus)
    try {
      await seasonalOffersService.update(id, { status: newStatus })
    } catch (err) {
      console.error('Failed to toggle status:', err)
      setError('Failed to update status. Please try again.')
    }
  }

  // Filtering
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleClearAllSeasonalOffers = async () => {
    if (window.confirm('Are you sure you want to delete ALL seasonal offers? This action cannot be undone.')) {
      try {
        console.log('Clearing all seasonal offers using service function')
        const result = await seasonalOffersService.clearAllSeasonalOffers()
        setSuccess(`Cleared ${result.count} seasonal offers successfully!`)
        setTimeout(() => setSuccess(''), 2000)
      } catch (err) {
        console.error('Failed to clear seasonal offers:', err)
        setError('Failed to clear seasonal offers. Please try again.')
      }
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Seasonal Offers Manager</h2>
          <p>Manage temporary and seasonal promotional offers. For Quick Offers, Packages, and Hair Offers, use Admin Services Manager.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Create Offer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters-bar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search seasonal offers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className="admin-btn-secondary" 
          style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
          onClick={handleClearAllSeasonalOffers}
        >
          Clear Seasonal Offers
        </button>
      </div>

      {/* Offers Grid */}
      <div className="admin-offers-grid">
        {loading ? (
          <div className="empty-state-card">Loading offers...</div>
        ) : offers.length > 0 ? (
          offers.map((offer, index) => (
            <motion.div 
              key={offer.id}
              className={`admin-offer-card ${offer.featured ? 'featured' : ''} ${offer.status === 'Inactive' ? 'inactive-card' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {offer.featured && <div className="featured-badge"><Tag size={12} /> Featured Offer</div>}
              
              <div className="offer-card-header">
                <span className={`status-badge ${offer.status.toLowerCase()}`}>
                  {offer.status}
                </span>
              </div>
              
              <div className="offer-card-body">
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>
                
                <div className="offer-pricing">
                  <div className="price-tag">
                    <span className="current-price">₹{Number(offer.offerPrice).toLocaleString()}</span>
                    {offer.originalPrice && (
                      <span className="original-price">₹{Number(offer.originalPrice).toLocaleString()}</span>
                    )}
                  </div>
                  {offer.originalPrice && offer.offerPrice < offer.originalPrice && (
                    <div className="discount-pill">
                      <Percent size={12} />
                      {Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="offer-validity">
                  <Calendar size={14} />
                  <span>Valid: {offer.startDate || 'Now'} - {offer.endDate || 'Ongoing'}</span>
                </div>
              </div>
              
              <div className="offer-card-footer">
                <button 
                  className={`toggle-status-btn ${offer.status === 'Active' ? 'disable' : 'enable'}`}
                  onClick={() => toggleStatus(offer.id)}
                >
                  {offer.status === 'Active' ? 'Disable Offer' : 'Enable Offer'}
                </button>
                <div className="card-actions-right">
                  <button className="action-btn edit" onClick={() => handleOpenModal(offer)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(offer.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state-card">
            <Tag size={48} opacity={0.2} />
            <p>No seasonal offers found. Create one to get started.</p>
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
                <h3>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                {error && <div className="admin-login-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                {success && <div className="admin-login-success" style={{color: 'green', marginBottom: '1rem'}}>{success}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Offer Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Summer Special"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Offer Price (₹)</label>
                    <input 
                      type="number" 
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. 699"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹) - Optional</label>
                    <input 
                      type="number" 
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. 1200"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Details about the package/offer..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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
                      Mark as Featured Offer
                    </label>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={handleCloseModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : (editingOffer ? 'Save Changes' : 'Create Offer')}
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

export default AdminOffers
