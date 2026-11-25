import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import galleryService from '../../services/galleryService'
import ImageUploader from '../../components/admin/ImageUploader'
import './AdminGallery.css'

const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    url: '',
    imagePublicId: '',
    alt: '',
    status: 'Active'
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Using subscribeToAll for real-time updates
    const unsub = galleryService.subscribeToAll((data) => {
      setGalleryItems(data || [])
      setLoading(false)
    }, (err) => {
      console.error('Failed to subscribe to gallery:', err)
      setError('Failed to load gallery.')
      setLoading(false)
    })
    
    return () => unsub && unsub()
  }, [])

  // Dynamic categories from real data
  const dynamicCategories = useMemo(() => {
    const categories = ['All', ...new Set(galleryItems.map(item => item.category).filter(Boolean))]
    return categories
  }, [galleryItems])

  // Handlers
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title || '',
        category: item.category || '',
        url: item.url || '',
        imagePublicId: item.imagePublicId || '',
        alt: item.alt || '',
        status: item.status || 'Active'
      })
    } else {
      setEditingItem(null)
      setFormData({ 
        title: '', category: '', url: '', imagePublicId: '', alt: '', status: 'Active' 
      })
    }
    setError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      url: imageData.imageUrl || '',
      imagePublicId: imageData.publicId || ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.url) {
      setError('Please upload an image first.')
      return
    }
    if (!formData.category.trim()) {
      setError('Please provide a category/tag.')
      return
    }
    
    setSaving(true)
    setError('')
    
    try {
      const dataToSave = {
        ...formData,
        category: formData.category.trim(),
        updatedAt: new Date().toISOString()
      }
      
      if (!editingItem) {
        dataToSave.createdAt = new Date().toISOString()
        await galleryService.create(dataToSave)
      } else {
        await galleryService.update(editingItem.id, dataToSave)
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving image:', err)
      setError('Failed to save image. ' + (err.message || ''))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      try {
        await galleryService.remove(id)
      } catch (err) {
        console.error('Failed to delete image:', err)
        alert('Failed to delete image.')
      }
    }
  }

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await galleryService.update(item.id, { status: newStatus })
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  // Filtering
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Gallery Manager</h2>
          <p>Control your portfolio images. No dummy data allowed.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters-bar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search title or tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {dynamicCategories.length > 1 && (
          <div className="category-filter">
            <div className="filter-label"><Filter size={14} /> Filters:</div>
            {dynamicCategories.map(cat => (
              <button 
                key={cat}
                className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="admin-gallery-grid">
        {loading ? (
          <div className="empty-gallery-state">
            <div className="loading-spinner"></div>
            <p>Loading your gallery...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="empty-gallery-state">
            <ImageIcon size={64} strokeWidth={1} />
            <h3>Gallery is empty</h3>
            <p>Upload your first work image to get started.</p>
            <button className="admin-btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleOpenModal()}>
              Upload Now
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <motion.div 
              key={item.id}
              className="admin-gallery-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="gallery-card-img-wrapper">
                <img src={item.url} alt={item.alt || item.title} loading="lazy" />
                <div 
                  className={`gallery-card-status ${(item.status || 'Active').toLowerCase()}`}
                  onClick={() => toggleStatus(item)}
                  style={{ cursor: 'pointer' }}
                  title="Click to toggle status"
                >
                  {item.status || 'Active'}
                </div>
                <div className="gallery-card-actions">
                  <button className="action-btn edit-solid" onClick={() => handleOpenModal(item)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete-solid" onClick={() => handleDelete(item.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="gallery-card-content">
                <span className="gallery-card-category">{item.category}</span>
                <h4 className="gallery-card-title">{item.title}</h4>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-gallery-state">
            <ImageIcon size={48} opacity={0.2} />
            <p>No images found matching your search.</p>
            <button className="admin-btn-secondary" onClick={() => {setSearchQuery(''); setFilterCategory('All');}}>
              Clear Filters
            </button>
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
                <h3>{editingItem ? 'Edit Image Details' : 'Upload New Image'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                {error && <div className="admin-error-banner">{error}</div>}
                
                <div className="form-group full-width">
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    existingImageUrl={formData.url}
                    existingPublicId={formData.imagePublicId}
                    label="Portfolio Image"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Elegant Bridal Look"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tag / Category</label>
                    <input 
                      type="text" 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Bridal Makeup, Hair Work"
                      required
                      list="prev-categories"
                    />
                    <datalist id="prev-categories">
                      {dynamicCategories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    <small style={{ color: '#888', marginTop: '4px' }}>Type a new tag or select existing</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Alt Text (Optional - SEO)</label>
                    <input 
                      type="text" 
                      name="alt"
                      value={formData.alt}
                      onChange={handleInputChange}
                      placeholder="Describe the image for search engines"
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active (Visible to public)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={handleCloseModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : (editingItem ? 'Save Changes' : 'Upload to Gallery')}
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

export default AdminGallery
