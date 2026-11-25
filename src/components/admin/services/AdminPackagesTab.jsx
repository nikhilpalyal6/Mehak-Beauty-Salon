import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import packagesService from '../../../services/packagesService'

const AdminPackagesTab = () => {
  const [packages, setPackages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    services: '',
    popular: false,
    status: 'Active',
    displayOrder: 0
  })

  useEffect(() => {
    const unsub = packagesService.subscribeToAll((data) => {
      const sorted = (data || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      setPackages(sorted)
    })
    
    return () => unsub && unsub()
  }, [])

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg)
      setFormData({
        ...pkg,
        services: Array.isArray(pkg.services) ? pkg.services.join('\n') : pkg.services
      })
    } else {
      setEditingPackage(null)
      setFormData({ name: '', price: '', services: '', popular: false, status: 'Active', displayOrder: packages.length })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPackage(null)
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
    try {
      const packageData = {
        ...formData,
        price: Number(formData.price),
        displayOrder: Number(formData.displayOrder),
        services: formData.services.split('\n').map(s => s.trim()).filter(s => s)
      }

      if (editingPackage) {
        await packagesService.update(editingPackage.id, packageData)
      } else {
        await packagesService.create(packageData)
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving package:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this package?')) {
      try {
        await packagesService.remove(id)
      } catch (err) {
        console.error('Failed to delete:', err)
      }
    }
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3>Premium Packages</h3>
          <p>Manage the salon packages and included services.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add Package</span>
        </button>
      </div>

      <div className="admin-table-container">
        {packages.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Package Name</th>
                <th>Price (₹)</th>
                <th>Popular</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>{pkg.displayOrder}</td>
                  <td className="font-medium">{pkg.name}</td>
                  <td>₹{pkg.price}</td>
                  <td>{pkg.popular ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`status-badge ${pkg.status.toLowerCase()}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button className="action-btn edit" onClick={() => handleOpenModal(pkg)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(pkg.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No packages found.</div>
        )}
      </div>

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
                <h3>{editingPackage ? 'Edit Package' : 'Add Package'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Package Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" name="popular" id="popular" checked={formData.popular} onChange={handleInputChange} style={{ width: 'auto' }} />
                  <label htmlFor="popular" style={{ margin: 0 }}>Mark as Popular Package (Featured)</label>
                </div>
                
                <div className="form-group full-width">
                  <label>Included Services (One per line)</label>
                  <textarea 
                    name="services" 
                    value={formData.services} 
                    onChange={handleInputChange} 
                    rows="6" 
                    placeholder="Bleach&#10;Facial&#10;Full Threading"
                    required 
                  />
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="admin-btn-primary">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPackagesTab