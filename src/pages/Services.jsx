import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Scissors, Droplet, Clock, Star, Crown, X, ChevronRight, Gem, Flame, Palette, Tag, Percent } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Services.css'
import servicesBg from '../assets/images/services.png'
import relaxingSpaSession from '../assets/images/Relaxingspasession.webp'

// Services - each manages its own collection
import seasonalOffersService from '../services/seasonalOffersService'
import quickOffersService from '../services/quickOffersService'
import packagesService from '../services/packagesService'
import hairOffersService from '../services/hairOffersService'
import regularServicesService from '../services/regularServicesService'
import servicesPageContentService from '../services/servicesPageContentService'
import { createWhatsAppLink } from '../utils/whatsapp'

import Skeleton from '../components/common/Skeleton'
import SEO from '../components/common/SEO'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// Helper for dynamic icons
const renderIcon = (type) => {
  switch (type) {
    case 'Scissors': return <Scissors size={28} />
    case 'Droplet': return <Droplet size={28} />
    case 'Sparkles': return <Sparkles size={28} />
    case 'Crown': return <Crown size={28} />
    case 'Star': return <Star size={28} />
    case 'Tag': return <Tag size={28} />
    default: return <Sparkles size={28} />
  }
}

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  // Data states - each for its own service
  const [seasonalOffers, setSeasonalOffers] = useState([])
  const [quickOffers, setQuickOffers] = useState([])
  const [packages, setPackages] = useState([])
  const [hairOffers, setHairOffers] = useState([])
  const [regularServices, setRegularServices] = useState([])
  const [pageContent, setPageContent] = useState(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribers = []

    // Helper to filter and sort data
    const processOffers = (data) => {
      return (data || [])
        .filter(item => item.status === 'Active')
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    }

    // Subscribe to seasonal offers
    const unsubSeasonalOffers = seasonalOffersService.subscribeToAll((data) => {
      const filtered = processOffers(data)
      setSeasonalOffers(filtered)
    })
    unsubscribers.push(unsubSeasonalOffers)

    // Subscribe to quick offers
    const unsubQuickOffers = quickOffersService.subscribeToAll((data) => {
      const filtered = processOffers(data)
      setQuickOffers(filtered)
    })
    unsubscribers.push(unsubQuickOffers)

    // Subscribe to packages
    const unsubPackages = packagesService.subscribeToAll((data) => {
      const filtered = processOffers(data)
      setPackages(filtered)
    })
    unsubscribers.push(unsubPackages)

    // Subscribe to hair offers
    const unsubHairOffers = hairOffersService.subscribeToAll((data) => {
      const filtered = processOffers(data)
      setHairOffers(filtered)
    })
    unsubscribers.push(unsubHairOffers)

    // Subscribe to regular services
    const unsubRegularServices = regularServicesService.subscribeToAll((data) => {
      const filtered = processOffers(data)
      setRegularServices(filtered)
      if (filtered.length > 0) {
        setActiveCategory(filtered[0].category)
      }
    })
    unsubscribers.push(unsubRegularServices)

    // Fetch page content
    servicesPageContentService.getContent().then(data => {
      if (data) {
        setPageContent(data)
      }
      setLoading(false)
    }).catch(err => {
      console.error("Failed to load page content:", err)
      setLoading(false)
    })

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isModalOpen])

  // Build display data dynamically for regular services
  let displayServices = {}
  regularServices.forEach(service => {
    const catName = service.category || 'Other'
    if (!displayServices[catName]) {
      displayServices[catName] = { name: catName, services: [] }
    }
    displayServices[catName].services.push(service)
  })

  const categories = Object.keys(displayServices)

  // Get the featured seasonal offer (for top banner)
  const seasonalFeaturedOffer = seasonalOffers.find(o => o.featured === true)
  
  // For hair offers modal, limit to 4 for initial display
  const featuredHairOffers = hairOffers.slice(0, 4)

  if (loading) {
    return (
      <div className="services-page" style={{ paddingTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px', padding: '100px 5%' }}>
        <Skeleton className="skeleton-card" style={{ height: '50vh' }} />
        <Skeleton className="skeleton-title" style={{ width: '30%', margin: '0 auto' }} />
        <div style={{ display: 'flex', gap: '20px' }}>
          {[1,2,3,4].map(n => <Skeleton key={n} className="skeleton-card" style={{ height: '200px' }} />)}
        </div>
      </div>
    )
  }

  const bgStyle = pageContent?.heroBgUrl ? { backgroundImage: `url(${pageContent.heroBgUrl})` } : { backgroundImage: `url(${servicesBg})` }

  return (
    <div className="services-page">
      <SEO
        title="Our Services - Mehak Salon & Spa"
        description="Explore our wide range of premium beauty services including bridal makeup, hair styling, spa, and more."
        image="https://mehaksalonandspa.in/og-image.jpg"
        url="https://mehaksalonandspa.in/services"
      />
      
      {/* Top Banner - Background image always visible, text only when seasonal offer exists */}
      <motion.section
        className="offer-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="offer-hero-bg" style={bgStyle}></div>
        
        {/* Show offer content only if seasonal featured offer exists */}
        {seasonalFeaturedOffer ? (
          <div className="hero-content">
            <motion.div
              className="badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Clock size={16} />
              <span>Limited Time Offer</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {seasonalFeaturedOffer.title}
            </motion.h1>

            <motion.p
              className="hero-subheading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {seasonalFeaturedOffer.description}
            </motion.p>

            {seasonalFeaturedOffer.startDate && seasonalFeaturedOffer.endDate && (
              <motion.div
                className="date-pill"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Star size={14} />
                <span>{seasonalFeaturedOffer.startDate} – {seasonalFeaturedOffer.endDate}</span>
              </motion.div>
            )}

            <motion.button
              className="hero-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(createWhatsAppLink({ type: 'offer', name: seasonalFeaturedOffer.title, price: seasonalFeaturedOffer.offerPrice }), '_blank', 'noopener,noreferrer')}
            >
              Book Offer Now - ₹{seasonalFeaturedOffer.offerPrice}
            </motion.button>
          </div>
        ) : (
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Our Beauty Services
            </motion.h1>
            <motion.p
              className="hero-subheading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Currently no offers available, visit our store for more offers
            </motion.p>
          </div>
        )}
      </motion.section>

      {/* Quick Beauty Offers Section - from quickOffersService */}
      {quickOffers.length > 0 && (
        <section className="quick-offers-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Quick Beauty Offers
          </motion.h2>

          <motion.div
            className="offers-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {quickOffers.map((offer) => (
              <motion.div
                key={offer.id}
                className="offer-card"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="offer-icon">{renderIcon(offer.iconType || 'Sparkles')}</div>
                <h3 className="offer-name">{offer.title}</h3>
                <div className="offer-price">₹{offer.price}</div>
                <button className="book-link" onClick={() => window.open(createWhatsAppLink({ type: 'offer', name: offer.title, price: offer.price }), '_blank', 'noopener,noreferrer')}>Book Now</button>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Premium Packages Section - from packagesService */}
      {packages.length > 0 && (
        <section className="packages-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Premium Packages
          </motion.h2>

          <motion.div
            className="packages-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                className={`package-card ${pkg.popular ? 'featured' : ''}`}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {pkg.popular && (
                  <div className="popular-badge">
                    <Star size={14} fill="currentColor" />
                    <span>Popular</span>
                  </div>
                )}
                <div className="package-price">₹{pkg.price}</div>
                <h3 className="package-name">{pkg.name}</h3>
                <ul className="package-services">
                  {pkg.services && Array.isArray(pkg.services) ? (
                    pkg.services.map((service, idx) => (
                      <li key={idx}>
                        <Sparkles size={14} />
                        {service}
                      </li>
                    ))
                  ) : (
                    pkg.services && pkg.services.split(',').map((service, idx) => (
                      <li key={idx}>
                        <Sparkles size={14} />
                        {service.trim()}
                      </li>
                    ))
                  )}
                </ul>
                <button className="package-button" onClick={() => window.open(createWhatsAppLink({ type: 'offer', name: pkg.name, price: pkg.price }), '_blank', 'noopener,noreferrer')}>Book Package</button>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Hair Offers Section - from hairOffersService */}
      {hairOffers.length > 0 && (
        <section className="hair-offers-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Hair Care Offers
          </motion.h2>

          <motion.div
            className="hair-offers-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featuredHairOffers.map((offer) => (
              <motion.div
                key={offer.id}
                className="hair-card"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <h3 className="hair-name">{offer.name || offer.title}</h3>
                <div className="hair-price">₹{offer.price}</div>
                <button className="hair-book-button" onClick={() => window.open(createWhatsAppLink({ type: 'offer', name: offer.name || offer.title, price: offer.price }), '_blank', 'noopener,noreferrer')}>Book Now</button>
              </motion.div>
            ))}
          </motion.div>

          {hairOffers.length > 4 && (
            <motion.button
              className="explore-more-button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
            >
              Explore More Hair Offers
              <ChevronRight size={18} />
            </motion.button>
          )}
        </section>
      )}

      {/* Hair Offers Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>

              <div className="modal-header">
                <h2 className="modal-title">All Hair Offers</h2>
                <p className="modal-subtitle">
                  Explore our complete range of professional hair care, styling and treatment offers.
                </p>
              </div>

              <div className="modal-offers-grid">
                {hairOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    className="modal-offer-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="modal-offer-info">
                      <h3 className="modal-offer-name">{offer.name || offer.title}</h3>
                      {(offer.detail || offer.description) && (
                        <span className="modal-offer-detail">{offer.detail || offer.description}</span>
                      )}
                    </div>
                    <div className="modal-offer-right">
                      <div className="modal-offer-price">₹{offer.price}</div>
                      <button className="modal-offer-book" onClick={() => window.open(createWhatsAppLink({ type: 'offer', name: offer.name || offer.title, price: offer.price }), '_blank', 'noopener,noreferrer')}>Book Now</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular Salon Services Section */}
      {regularServices.length > 0 && (
        <section className="regular-services-section">
          <motion.div
            className="regular-services-banner"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="rsb-background">
              <img src={relaxingSpaSession} alt="Salon Services" />
              <div className="rsb-overlay"></div>
            </div>
            
            <div className="rsb-content">
              <div className="section-badge rsb-badge">
                <Sparkles size={16} />
                <span>Salon Menu</span>
              </div>
              <h2 className="rsb-title">Regular Beauty Services</h2>
              <p className="rsb-subtitle">
                Explore facial, hair, nails, waxing and beauty treatments crafted for everyday elegance.
              </p>
              
              <div className="rsb-chips">
                <span className="rsb-chip">💄 Facial Care</span>
                <span className="rsb-chip">✨ Hair Treatments</span>
                <span className="rsb-chip">💅 Nail Studio</span>
                <span className="rsb-chip">🌸 Spa Rituals</span>
              </div>
              
              <div className="rsb-buttons">
                <button className="book-btn">Explore Services</button>
                <button className="book-btn outline" onClick={() => window.open(createWhatsAppLink({ type: 'general' }), '_blank', 'noopener,noreferrer')}>Book Appointment</button>
              </div>
            </div>
            <div className="rsb-curved-edge"></div>
          </motion.div>

          <motion.div
            className="category-tabs"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {displayServices[category]?.name || category}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {activeCategory && displayServices[activeCategory] && (
              <motion.div
                key={activeCategory}
                className="services-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {displayServices[activeCategory].services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className={`service-row ${activeCategory?.toLowerCase() === 'nails' ? 'nail-service' : ''}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="service-info">
                      <div className="service-name-wrapper">
                        <h3 className="service-name">{service.name}</h3>
                      </div>
                      <span className="service-category">{displayServices[activeCategory].name || activeCategory}</span>
                    </div>
                    <div className="service-right">
                      <div className="service-price-badge">
                        {typeof service.price === 'string' && service.price.includes('₹') ? service.price : `₹${service.price}`}
                      </div>
                      <button className="service-book-btn" onClick={() => window.open(createWhatsAppLink({ type: 'service', name: service.name, price: service.price, category: displayServices[activeCategory].name || activeCategory }), '_blank', 'noopener,noreferrer')}>Book Now</button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </div>
  )
}

export default Services
