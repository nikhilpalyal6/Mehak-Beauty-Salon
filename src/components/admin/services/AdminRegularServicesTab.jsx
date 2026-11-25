import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import regularServicesService from '../../../services/regularServicesService'

const CATEGORIES = [
  'Face & Skin',
  'Threading',
  'Waxing & Body Care',
  'Hands & Feet',
  'Nails',
  'Hair Treatments',
  'Hair Color',
  'Makeup'
]

const AdminRegularServicesTab = () => {
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Face & Skin',
    price: '',
    status: 'Active',
    displayOrder: 0
  })

  useEffect(() => {
    const unsub = regularServicesService.subscribeToAll((data) => {
      const sorted = (data || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      setServices(sorted)

      // Auto-seed makeup if missing
      if (data && data.length > 0) {
        const hasMakeup = data.some(s => s.category === 'Makeup');
        if (!hasMakeup && !window.__makeupSeeded) {
          window.__makeupSeeded = true;
          const makeupData = [
            { name: 'Basic Party Makeup', category: 'Makeup', price: '1500', status: 'Active', displayOrder: 35 },
            { name: 'Advance Party Makeup', category: 'Makeup', price: '2500', status: 'Active', displayOrder: 36 },
            { name: 'Engagement Makeup', category: 'Makeup', price: '3500', status: 'Active', displayOrder: 37 },
            { name: 'Shagan Makeup', category: 'Makeup', price: '4500', status: 'Active', displayOrder: 38 },
            { name: 'Basic Bridal Makeup', category: 'Makeup', price: '6000', status: 'Active', displayOrder: 39 },
            { name: 'Advance Bridal Makeup', category: 'Makeup', price: '8000', status: 'Active', displayOrder: 40 }
          ];
          makeupData.forEach(item => {
            regularServicesService.create(item).catch(err => console.error(err));
          });
        }
      }
    })
    
    return () => unsub && unsub()
  }, [])

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setFormData(service)
    } else {
      setEditingService(null)
      setFormData({ name: '', category: 'Face & Skin', price: '', status: 'Active', displayOrder: services.length })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const serviceData = {
        ...formData,
        displayOrder: Number(formData.displayOrder)
      }

      if (editingService) {
        await regularServicesService.update(editingService.id, serviceData)
      } else {
        await regularServicesService.create(serviceData)
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving regular service:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await regularServicesService.remove(id)
      } catch (err) {
        console.error('Failed to delete:', err)
      }
    }
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3>Regular Services</h3>
          <p>Manage the main categorised salon services.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="admin-table-container">
        {services.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.displayOrder}</td>
                  <td className="font-medium">{service.name}</td>
                  <td><span className="category-badge">{service.category}</span></td>
                  <td>{service.price}</td>
                  <td>
                    <span className={`status-badge ${service.status.toLowerCase()}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button className="action-btn edit" onClick={() => handleOpenModal(service)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(service.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No regular services found.</div>
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
                <h3>{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (Allows text like '₹500 / ₹800')</label>
                    <input type="text" name="price" value={formData.price} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} />
                  </div>
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

export default AdminRegularServicesTab