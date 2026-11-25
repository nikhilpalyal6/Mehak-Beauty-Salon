import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { Sparkles, Shield, GraduationCap, Star, Quote, Users, Award, Calendar, ChevronRight, ChevronLeft, ArrowRight, Tag, Percent, Clock } from 'lucide-react'
import './Home.css'
import Skeleton from '../components/common/Skeleton'
import SEO from '../components/common/SEO'

import frontImage from '../assets/images/front.png'
import elegantBridalLook from '../assets/images/Elegant Bridal Look.png'
import modernHairArt from '../assets/images/ModernHairart.jpg'
import glowingSkinTreatment from '../assets/images/Glowingskintreatment.jpg'
import relaxingSpaSession from '../assets/images/Relaxingspasession.webp'
import trainingSession from '../assets/images/Trainingsession.png'
import premiumSalonSpace from '../assets/images/Premiumsalon space.png'
import premium2Image from '../assets/images/Premium2.png'
import ctaBackgroundImage from '../assets/images/CTA_background.png'

import bridalPlaceholder from '../assets/placeholders/bridal.jpg'
import hairPlaceholder from '../assets/placeholders/hair.jpg'
import spaPlaceholder from '../assets/placeholders/spa.jpeg'
import coursePlaceholder from '../assets/placeholders/course.jpg'

import servicesService from '../services/servicesService'
import coursesService from '../services/coursesService'
import galleryService from '../services/galleryService'
import testimonialsService from '../services/testimonialsService'
import contentService from '../services/contentService'
import offersService from '../services/offersService'
import { createWhatsAppLink } from '../utils/whatsapp'

// Fallback Data
const fallbackServices = [
  { id: 1, title: 'Bridal Makeup', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80' },
  { id: 2, title: 'Hair Styling', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80' },
  { id: 3, title: 'Spa & Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80' },
  { id: 4, title: 'Facial & Skin Care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80' },
  { id: 5, title: 'Beauty Courses', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' }
]

const fallbackCourses = [
  { id: 1, title: 'Professional Makeup Course', description: 'Master the art of professional makeup with hands-on training from industry experts.', duration: '3 Months', certified: true, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', featured: false },
  { id: 2, title: 'Hair Styling & Care', description: 'Learn advanced hair cutting, coloring, and styling techniques for all hair types.', duration: '2 Months', certified: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', featured: true },
  { id: 3, title: 'Spa & Skin Therapy', description: 'Comprehensive training in spa treatments, facials, and advanced skin care therapies.', duration: '3 Months', certified: true, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', featured: false },
  { id: 4, title: 'Bridal Artistry', description: 'Specialized bridal makeup and hairstyling for weddings and special occasions.', duration: '4 Months', certified: true, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', featured: false }
]

const fallbackGalleryItems = [
  { id: 1, category: 'Bridal Makeup', title: 'Elegant Bridal Look', image: elegantBridalLook, size: 'featured' },
  { id: 2, category: 'Hair Styling', title: 'Modern Hair Art', image: modernHairArt, size: 'standard' },
  { id: 3, category: 'Skin Care', title: 'Glowing Skin Treatment', image: glowingSkinTreatment, size: 'standard' },
  { id: 4, category: 'Spa Therapy', title: 'Relaxing Spa Session', image: relaxingSpaSession, size: 'standard' },
  { id: 5, category: 'Beauty Courses', title: 'Training Session', image: trainingSession, size: 'standard' },
  { id: 6, category: 'Salon Interior', title: 'Premium Salon Space', image: premiumSalonSpace, size: 'wide' }
]

const fallbackTestimonials = [
  { id: 1, name: 'Priya Sharma', serviceUsed: 'Bridal Makeup', review: 'Absolutely loved my bridal makeup. The look was elegant, long-lasting and exactly what I wanted.', featured: false, rating: 5 },
  { id: 2, name: 'Neha Verma', serviceUsed: 'Spa Therapy', review: 'The spa experience was so relaxing and hygienic. The staff made me feel completely comfortable.', featured: true, rating: 5 },
  { id: 3, name: 'Simran Kaur', serviceUsed: 'Beauty Course', review: 'I joined the makeup course and learned so much with proper guidance and hands-on practice.', featured: false, rating: 5 }
]

const stats = [
  { id: 1, number: '500+', label: 'Happy Clients', icon: Users },
  { id: 2, number: '5+', label: 'Years Experience', icon: Calendar },
  { id: 3, number: '100%', label: 'Certified Experts', icon: Award },
  { id: 4, number: '10+', label: 'Beauty Courses', icon: GraduationCap }
]

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isGalleryHovered, setIsGalleryHovered] = useState(false)

  // Firestore Data State
  const [servicesData, setServicesData] = useState([])
  const [coursesData, setCoursesData] = useState([])
  const [galleryData, setGalleryData] = useState([])
  const [testimonialsData, setTestimonialsData] = useState([])
  const [contentData, setContentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, coursesRes, galleryRes, testimonialsRes, contentRes] = await Promise.all([
          servicesService.getAll(),
          coursesService.getAll(),
          galleryService.getAll(),
          testimonialsService.getAll(),
          contentService.getById('main')
        ])

        setServicesData(servicesRes.filter(s => s.status === 'Active'))
        setCoursesData(coursesRes.filter(c => c.status === 'Active'))
        setGalleryData(galleryRes)
        setTestimonialsData(testimonialsRes.filter(t => t.status === 'Approved'))
        
        setContentData(contentRes)
      } catch (err) {
        console.error("Failed to load home data:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()

    // Subscribe to real-time content updates
    const unsubscribeContent = contentService.subscribeToDocument('main', (contentRes) => {
      if (contentRes) {
        setContentData(contentRes)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeContent) unsubscribeContent()
    }
  }, [])

  const displayServices = servicesData
  const displayCourses = coursesData
  const displayGallery = galleryData
  const displayTestimonials = testimonialsData
  
  const heroData = contentData?.hero || {}
  const aboutData = contentData?.about || {}
  const ctaData = contentData?.cta || {}

  const nextSlide = useCallback(() => {
    setActiveGalleryIndex((prev) => (prev + 1) % displayGallery.length)
  }, [displayGallery.length])

  const prevSlide = useCallback(() => {
    setActiveGalleryIndex((prev) => (prev - 1 + displayGallery.length) % displayGallery.length)
  }, [displayGallery.length])

  const handleBookAppointment = () => {
    window.open(createWhatsAppLink({ type: 'general' }), '_blank', 'noopener,noreferrer')
  }

  const handleExploreServices = () => {
    window.location.href = '/services'
  }

  useEffect(() => {
    if (!isGalleryHovered && displayGallery.length > 0) {
      const interval = setInterval(nextSlide, 4000)
      return () => clearInterval(interval)
    }
  }, [isGalleryHovered, nextSlide, displayGallery.length])

  if (loading) {
    return (
      <div className="home" style={{ paddingTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px', padding: '100px 5%' }}>
        <Skeleton className="skeleton-card" style={{ height: '70vh' }} />
        <Skeleton className="skeleton-title" style={{ width: '40%', margin: '0 auto' }} />
        <div style={{ display: 'flex', gap: '20px' }}>
          {[1,2,3,4].map(n => <Skeleton key={n} className="skeleton-card" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <SEO
        title="Mehak Salon & Spa | Premium Beauty Salon"
        description="Premium salon, spa, bridal makeup, beauty courses and grooming services at Mehak Salon & Spa."
        image="https://mehaksalonandspa.in/og-image.jpg"
        url="https://mehaksalonandspa.in"
      />
      <section className="hero">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-blob blob-3"></div>
        
        <div className="hero-container">
          <div className="hero-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-badge">{heroData.badgeText || 'Premium Beauty & Wellness'}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {heroData.mainHeading ? heroData.mainHeading : <>Glow <span className="highlight">Naturally</span>, Feel Beautiful</>}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-subheading"
            >
              {heroData.subHeading || 'Experience luxury salon, spa, bridal and beauty services designed to make every visit feel special.'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hero-buttons"
            >
              <button className="cta-button primary" onClick={handleBookAppointment}>{heroData.primaryButtonText || 'Book Appointment'}</button>
              <button className="cta-button secondary" onClick={handleExploreServices}>{heroData.secondaryButtonText || 'Explore Services'}</button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-trust"
            >
              <span>Salon</span>
              <span className="separator">•</span>
              <span>Spa</span>
              <span className="separator">•</span>
              <span>Bridal</span>
              <span className="separator">•</span>
              <span>Beauty Courses</span>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-right"
          >
            <div className="hero-image-card">
              <div className="hero-glow"></div>
              <img src={frontImage} alt="Mehak Salon & Spa" className="hero-front-image" />
              
              <div className="hero-floating-card card-1">
                <Star size={16} color="var(--gold)" /> Premium Salon
              </div>
              <div className="hero-floating-card card-2">
                <Award size={16} color="var(--gold)" /> Bridal Specialist
              </div>
              <div className="hero-floating-card card-3">
                <GraduationCap size={16} color="var(--gold)" /> Certified Training
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="services-preview">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="services-header"
        >
          <h2 className="services-title">Our Signature Services</h2>
          <p className="services-subtitle">Premium salon, spa and bridal experiences crafted for your beauty and comfort.</p>
        </motion.div>

        <div className="signature-services-grid">
          {[
            { id: 1, title: 'Bridal Makeup', text: 'Luxury bridal looks and event styling.', image: bridalPlaceholder },
            { id: 2, title: 'Hair Styling', text: 'Cuts, styling, keratin and treatments.', image: hairPlaceholder },
            { id: 3, title: 'Skin & Wellness', text: 'Relaxing therapies and body care.', image: spaPlaceholder },
            { id: 4, title: 'Beauty Courses', text: 'Professional salon training programs.', image: coursePlaceholder }
          ].map((service, index) => (
            <motion.div
              key={service.id}
              className="signature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <img src={service.image} alt={service.title} className="signature-img" />
              <div className="signature-overlay"></div>
              <div className="signature-content">
                <h3 className="signature-title">{service.title}</h3>
                <p className="signature-text">{service.text}</p>
                <button className="signature-btn" onClick={() => window.location.href = '/services'}>Explore <ChevronRight size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="about-container"
        >
          <div className="about-image">
            <div className="about-image-card">
              <img
                src={premium2Image}
                alt="Mehak Salon & Spa storefront"
                className="about-salon-image"
              />
            </div>
          </div>

          <div className="about-content">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="about-badge"
            >
              {aboutData.sectionBadge || 'About Our Salon'}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="about-heading"
            >
              {aboutData.heading || 'Where Beauty Meets Comfort'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="about-text"
            >
              {aboutData.description || 'Mehak Salon & Spa is designed to bring premium beauty, wellness and grooming experiences in a calm, elegant and comfortable environment. From bridal makeup to relaxing spa services and professional beauty courses, every service is delivered with care, hygiene and attention to detail.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="about-trust-points"
            >
              <div className="trust-point">
                <Sparkles className="trust-icon" />
                <span>Premium Beauty Services</span>
              </div>
              <div className="trust-point">
                <Shield className="trust-icon" />
                <span>Hygienic & Comfortable Space</span>
              </div>
              <div className="trust-point">
                <GraduationCap className="trust-icon" />
                <span>Bridal, Spa & Training Expertise</span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="about-button"
              onClick={() => window.location.href = '/about'}
            >
              Explore more about us
            </motion.button>
          </div>
        </motion.div>
      </section>

      <section className="courses-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="courses-header"
        >
          <span className="courses-badge">Professional Training</span>
          <h2 className="courses-title">Learn Beauty From Industry Experts</h2>
          <p className="courses-subtitle">Join our professional beauty and grooming courses designed for beginners and aspiring beauty professionals.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="courses-grid"
        >
          {displayCourses.slice(0, 4).map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`course-card ${course.featured ? 'featured' : ''}`}
            >
              <div className="course-image">
                <img src={course.imageUrl || course.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'} alt={course.title || course.name} />
                <div className="course-overlay"></div>
              </div>
              <div className="course-content">
                <div className="course-badges">
                  <span className="course-duration">{course.duration}</span>
                  {(course.certified || true) && (
                    <span className="course-certified">Certified Training</span>
                  )}
                </div>
                <h3 className="course-title">{course.title || course.name}</h3>
                <p className="course-description">{course.description}</p>
                <button className="course-button" onClick={() => window.location.href = '/courses'}>Enroll Now</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="gallery-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="gallery-header"
        >
          <span className="gallery-badge">Our Work</span>
          <h2 className="gallery-title">Moments of Beauty & Elegance</h2>
          <p className="gallery-subtitle">A glimpse of our bridal looks, salon transformations, spa moments and training sessions.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="gallery-carousel-container"
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
        >
          <div className="carousel-track">
            {displayGallery.map((item, index) => {
              let relativeIndex = index - activeGalleryIndex
              if (relativeIndex < -2) relativeIndex += displayGallery.length
              if (relativeIndex > 2) relativeIndex -= displayGallery.length

              let positionClass = 'hidden'
              if (relativeIndex === 0) positionClass = 'active'
              else if (relativeIndex === -1 || (activeGalleryIndex === 0 && index === displayGallery.length - 1)) positionClass = 'prev'
              else if (relativeIndex === 1 || (activeGalleryIndex === displayGallery.length - 1 && index === 0)) positionClass = 'next'

              return (
                <div key={item.id} className={`carousel-card ${positionClass}`}>
                  <div className="gallery-placeholder">
                    <img
                      src={item.url || item.image || item.imageUrl || frontImage}
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <span className="gallery-category">{item.category}</span>
                      <h3 className="gallery-item-title">{item.title}</h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="carousel-nav-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-nav-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          <div className="carousel-indicators">
            {displayGallery.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === activeGalleryIndex ? 'active' : ''}`}
                onClick={() => setActiveGalleryIndex(index)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="testimonials-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="testimonials-header"
        >
          <span className="testimonials-badge">Client Stories</span>
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">Real experiences from clients who trusted Mehak Salon & Spa for their special moments.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="testimonials-grid"
        >
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`testimonial-card ${testimonial.featured ? 'featured' : ''}`}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="quote-icon"
              >
                <Quote />
              </motion.div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star" style={{ fill: i < (testimonial.rating || 5) ? 'currentColor' : 'none' }} />
                ))}
              </div>
              <p className="testimonial-review">{testimonial.review || testimonial.text}</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">
                  {testimonial.imageUrl ? (
                    <img src={testimonial.imageUrl} alt={testimonial.name || testimonial.customerName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span>{(testimonial.name || testimonial.customerName).split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name || testimonial.customerName}</h4>
                  <span className="testimonial-service">{testimonial.service || testimonial.serviceUsed}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="stats-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="stats-container"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="stat-item"
            >
              <div className="stat-icon">
                <stat.icon />
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.3, type: "spring" }}
                className="stat-number"
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
              {index < stats.length - 1 && <div className="stat-divider"></div>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="cta-container"
        >
          <div className="cta-background">
            <img src={ctaBackgroundImage} alt="CTA Background" className="cta-bg-img" />
            <div className="cta-overlay"></div>
          </div>
          <div className="cta-content">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="cta-badge"
            >
              {ctaData.badgeText || 'Book Your Experience'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="cta-title"
            >
              {ctaData.heading || 'Your Luxury Beauty Journey Starts Here'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="cta-subtitle"
            >
              {ctaData.description || 'From bridal elegance to relaxing spa therapies, let Mehak Salon & Spa bring out your confidence and beauty.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="cta-buttons"
            >
              <button className="cta-button primary" onClick={handleBookAppointment}>{ctaData.buttonText || 'Book Appointment'}</button>
              <button className="cta-button secondary" onClick={() => window.location.href = '/contact'}>Contact Us</button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
