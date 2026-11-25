import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import hairOffersService from '../../../services/hairOffersService'

const AdminHairOffersTab = () => {
  const [offers, setOffers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    price: '',
    status: 'Active',
    displayOrder: 0
  })

  useEffect(() => {
    const unsub = hairOffersService.subscribeToAll((data) => {
      const sorted = (data || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      setOffers(sorted)
    })
    
    return () => unsub && unsub()
  }, [])

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData(offer)
    } else {
      setEditingOffer(null)
      setFormData({ name: '', detail: '', price: '', status: 'Active', displayOrder: offers.length })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOffer(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const offerData = {
        ...formData,
        price: Number(formData.price),
        displayOrder: Number(formData.displayOrder)
      }

      if (editingOffer) {
        await hairOffersService.update(editingOffer.id, offerData)
      } else {
        await hairOffersService.create(offerData)
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving hair offer:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this hair offer?')) {
      try {
        await hairOffersService.remove(id)
      } catch (err) {
        console.error('Failed to delete:', err)
      }
    }
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3>Hair Offers</h3>
          <p>Manage standard hair care offers and pricing.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add Hair Offer</span>
        </button>
      </div>

      <div className="admin-table-container">
        {offers.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Service Name</th>
                <th>Detail</th>
                <th>Price (₹)</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id}>
                  <td>{offer.displayOrder}</td>
                  <td className="font-medium">{offer.name}</td>
                  <td>{offer.detail || '-'}</td>
                  <td>₹{offer.price}</td>
                  <td>
                    <span className={`status-badge ${offer.status.toLowerCase()}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button className="action-btn edit" onClick={() => handleOpenModal(offer)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(offer.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No hair offers found.</div>
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
                <h3>{editingOffer ? 'Edit Hair Offer' : 'Add Hair Offer'}</h3>
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
                    <label>Detail (Optional)</label>
                    <input type="text" name="detail" value={formData.detail} onChange={handleInputChange} placeholder="e.g. Mid Length" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
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

export default AdminHairOffersTab