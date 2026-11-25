import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Sparkles } from 'lucide-react'
import SEO from '../components/common/SEO'
import galleryService from '../services/galleryService'
import Skeleton from '../components/common/Skeleton'
import './Gallery.css'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState(null)

  const handleFilterChange = (cat) => {
    setFilter(cat)
    // Smooth scroll to grid top
    const gridElement = document.querySelector('.gallery-grid')
    if (gridElement) {
      const top = gridElement.getBoundingClientRect().top + window.pageYOffset - 150
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Subscribe to real-time updates
    const unsub = galleryService.subscribeToAll((data) => {
      // Only show Active images
      const activeImages = (data || []).filter(img => img.status === 'Active')
      setImages(activeImages)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching gallery images:', err)
      setLoading(false)
    })

    return () => unsub && unsub()
  }, [])

  // Generate categories dynamically from active images
  const categories = useMemo(() => {
    const uniqueTags = [...new Set(images.map(img => img.category).filter(Boolean))]
    return ['All', ...uniqueTags]
  }, [images])

  const filteredImages = useMemo(() => {
    return filter === 'All' 
      ? images 
      : images.filter(img => img.category === filter)
  }, [filter, images])

  return (
    <div className="gallery-page">
      <SEO 
        title="Gallery | Mehak Beauty Salon" 
        description="Explore our real portfolio of bridal makeup, hair styling, and salon transformations at Mehak Beauty Salon."
      />

      <header className="gallery-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="gallery-badge">
            <Sparkles size={16} style={{ marginRight: '8px' }} />
            Our Portfolio
          </span>
          <h1>Our Gallery</h1>
          <p>Authentic transformations and beauty moments captured at our salon.</p>
        </motion.div>
      </header>

      <div className="gallery-container">
        {/* Dynamic Category Filter */}
        {categories.length > 1 && (
          <motion.div 
            className="category-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat)}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="gallery-item-skeleton">
                <Skeleton height="350px" width="100%" borderRadius="20px" />
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div 
            className="premium-empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Camera size={64} strokeWidth={1} />
            <h2>Our gallery will be updated soon</h2>
            <p>We are currently curating our best work to showcase here. Please check back later or visit us for a personal consultation.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="gallery-grid"
          >
            <AnimatePresence mode='popLayout'>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, cubicBezier: [0.4, 0, 0.2, 1] }}
                  className="gallery-item"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="image-wrapper">
                    <img src={image.url} alt={image.alt || image.title} loading="lazy" />
                    <div className="image-overlay">
                      <h3>{image.title}</h3>
                      <span>{image.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && images.length > 0 && filteredImages.length === 0 && (
          <div className="no-images">
            <p>No images found in the "{filter}" category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-lightbox" onClick={() => setSelectedImage(null)}>&times;</button>
              <img src={selectedImage.url} alt={selectedImage.alt || selectedImage.title} />
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery
