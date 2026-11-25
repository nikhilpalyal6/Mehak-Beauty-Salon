import React, { useState, useEffect } from 'react'
import servicesPageContentService from '../../../services/servicesPageContentService'
import ImageUploader from '../ImageUploader'

const AdminPageContentTab = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    heroBadge: 'Limited Time Offer',
    heroHeading: 'Special Summer Beauty Offers',
    heroSubtitle: 'Refresh your look with our exclusive seasonal packages designed for ultimate relaxation and glow.',
    offerDate: 'Valid till 30th June',
    primaryButtonText: 'Book Now',
    heroBgUrl: '',
    heroBgPublicId: ''
  })

  useEffect(() => {
    const unsub = servicesPageContentService.subscribe((data) => {
      if (data) {
        setFormData(prev => ({ ...prev, ...data }))
      }
      setLoading(false)
    })
    
    return () => unsub && unsub()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      heroBgUrl: imageData.imageUrl || '',
      heroBgPublicId: imageData.publicId || ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setSuccessMsg('')
      await servicesPageContentService.updateContent(formData)
      setSuccessMsg('Page content updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Failed to save content:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="empty-state">Loading page content...</div>

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3>Services Page Content</h3>
          <p>Customize the hero section of the public Services page.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-container" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        
        <div className="form-row" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Badge</label>
            <input 
              type="text" 
              name="heroBadge" 
              value={formData.heroBadge} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Offer Date Text</label>
            <input 
              type="text" 
              name="offerDate" 
              value={formData.offerDate} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Heading</label>
            <input 
              type="text" 
              name="heroHeading" 
              value={formData.heroHeading} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Subtitle</label>
            <textarea 
              name="heroSubtitle" 
              value={formData.heroSubtitle} 
              onChange={handleInputChange} 
              rows="3"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }} 
            />
          </div>
        </div>
        
        <div className="form-row" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Primary Button Text</label>
            <input 
              type="text" 
              name="primaryButtonText" 
              value={formData.primaryButtonText} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <ImageUploader
              onImageSelect={handleImageSelect}
              existingImageUrl={formData.heroBgUrl}
              existingPublicId={formData.heroBgPublicId}
              label="Hero Background Image"
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Content'}
          </button>
          {successMsg && <span style={{ color: 'green', fontWeight: 500 }}>{successMsg}</span>}
        </div>
      </form>
    </div>
  )
}

export default AdminPageContentTab
