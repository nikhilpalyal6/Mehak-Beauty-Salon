import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import coursesService from '../../services/coursesService'
import ImageUploader from '../../components/admin/ImageUploader'
import './AdminCourses.css'

const CATEGORIES = ['All', 'Personal Grooming', 'Beauty Foundation', 'Professional Training', 'Nail Art & Extensions', 'Hair Styling & Treatments']

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Personal Grooming',
    price: '',
    duration: '',
    rating: '5.0',
    enrolledCount: '0',
    status: 'Active',
    description: '',
    imageUrl: '',
    imagePublicId: ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await coursesService.getAll()
      setCourses(data)
    } catch (err) {
      console.error('Failed to load courses:', err)
      setError('Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course)
      setFormData(course)
    } else {
      setEditingCourse(null)
      setFormData({ 
        name: '', category: 'Personal Grooming', price: '', 
        duration: '', rating: '5.0', enrolledCount: '0', status: 'Active', description: '', imageUrl: '', imagePublicId: '' 
      })
    }
    setError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCourse(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      const courseData = {
        ...formData,
        price: Number(formData.price),
        enrolledCount: Number(formData.enrolledCount)
      }

      if (editingCourse) {
        await coursesService.update(editingCourse.id, courseData)
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...courseData, id: c.id } : c))
      } else {
        const newCourse = await coursesService.create(courseData)
        setCourses(prev => [...prev, newCourse])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving course:', err)
      setError('Failed to save course.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await coursesService.remove(id)
        setCourses(prev => prev.filter(c => c.id !== id))
      } catch (err) {
        console.error('Failed to delete course:', err)
        alert('Failed to delete course.')
      }
    }
  }

  // Filtering
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Courses Manager</h2>
          <p>Manage academy courses, enrollments, and details.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters-bar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="empty-state">Loading courses...</div>
        ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course Details</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price (₹)</th>
              <th>Stats</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div className="course-title-cell">
                      <span className="font-medium">{course.name}</span>
                      <span className="course-desc-preview">{course.description.substring(0, 30)}...</span>
                    </div>
                  </td>
                  <td><span className="category-badge">{course.category}</span></td>
                  <td>{course.duration}</td>
                  <td>₹{Number(course.price).toLocaleString()}</td>
                  <td>
                    <div className="course-stats-cell">
                      <span className="rating-pill"><Star size={12} className="star-icon"/> {course.rating}</span>
                      <span className="enrollment-text">{course.enrolledCount} students</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${course.status.toLowerCase()}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button className="action-btn edit" onClick={() => handleOpenModal(course)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(course.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
                <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                <button className="close-modal" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Course Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Basic Bridal Makeup"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 25000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input 
                      type="text" 
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Weeks"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating (Out of 5.0)</label>
                    <input 
                      type="text" 
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      placeholder="e.g. 4.8"
                    />
                  </div>
                  <div className="form-group">
                    <label>Enrolled Students</label>
                    <input 
                      type="number" 
                      name="enrolledCount"
                      value={formData.enrolledCount}
                      onChange={handleInputChange}
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Short Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Short description of the course..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    existingImageUrl={formData.imageUrl}
                    existingPublicId={formData.imagePublicId}
                    label="Course Image (Optional)"
                  />
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingCourse ? 'Save Changes' : 'Add Course'}
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

export default AdminCourses
