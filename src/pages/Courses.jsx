import { motion } from 'framer-motion'
import { GraduationCap, Award, Users, BookOpen, CheckCircle, ArrowRight, Sparkles, TrendingUp, Shield, Clock, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Courses.css'
import premiumAcademyImage from '../assets/images/premiumacademy.png'
import selfCourseImage from '../assets/images/Selfcourse.png'
import basicCourseImage from '../assets/images/Basiccourse.png'
import advanceCourseImage from '../assets/images/Advance course.png'
import nailCourseImage from '../assets/images/Nailcourse.png'
import hairCourseImage from '../assets/images/Haircourse.png'
import ctaBackgroundImage from '../assets/images/CTA_background.png'

import coursesService from '../services/coursesService'
import Skeleton from '../components/common/Skeleton'
import SEO from '../components/common/SEO'
import { createWhatsAppLink } from '../utils/whatsapp'

const fallbackCourses = [
  {
    id: 'self-course',
    title: 'Self Course',
    image: selfCourseImage,
    price: '₹15,000',
    duration: '2 Weeks',
    category: 'Personal Grooming',
    rating: '4.8',
    students: '120+',
    certified: true,
    description: 'A personal grooming course designed to help learners understand everyday beauty, makeup basics, skincare routine and self-styling techniques with practical guidance.',
    featured: false,
    learningPoints: [
      'Makeup Basics',
      'Skin Preparation',
      'Personal Grooming',
      'Product Knowledge',
      'Hair Styling Basics',
      'Practice Sessions'
    ],
    includes: [
      'Hands-on training',
      'Professional guidance',
      'Practice-based learning',
      'Certificate after completion',
      'Salon environment exposure',
      'Beginner-friendly sessions'
    ]
  },
  {
    id: 'basic-course',
    title: 'Basic Course',
    image: basicCourseImage,
    price: '₹30,000',
    duration: '1 Month',
    category: 'Beauty Foundation',
    rating: '4.9',
    students: '80+',
    certified: true,
    description: 'The Basic Course is designed for learners who want to build a strong foundation in beauty, skincare and salon services. The course combines theory, demonstrations and practical learning sessions.',
    featured: false,
    learningPoints: [
      'Basic Makeup Techniques',
      'Skin Preparation',
      'Facial Basics',
      'Product Knowledge',
      'Salon Hygiene',
      'Client Handling',
      'Hair Basics',
      'Practical Sessions'
    ],
    includes: [
      'Hands-on Training',
      'Practice Sessions',
      'Professional Guidance',
      'Certification',
      'Beginner Friendly',
      'Salon Exposure'
    ]
  },
  {
    id: 'advance-course',
    title: 'Advance Course',
    image: advanceCourseImage,
    price: '₹50,000',
    duration: '2 Months',
    category: 'Professional Beauty Training',
    rating: '4.9',
    students: '100+',
    certified: true,
    description: 'The Advance Course is designed for learners who want to build professional-level skills in makeup, skin, salon services and client-ready beauty techniques. This course focuses on advanced practice, service confidence and real salon exposure.',
    featured: true,
    learningPoints: [
      'Advanced Makeup Techniques',
      'Bridal Makeup Basics',
      'Party Makeup Looks',
      'Skin Analysis',
      'Facial & Treatment Knowledge',
      'Product Selection',
      'Professional Client Handling',
      'Salon Service Workflow',
      'Portfolio Practice'
    ],
    includes: [
      'Advanced Hands-on Training',
      'Live Demonstrations',
      'Practice Sessions',
      'Professional Guidance',
      'Certification',
      'Salon Environment Exposure',
      'Portfolio Building Support',
      'Client Handling Training'
    ]
  },
  {
    id: 'nails-course',
    title: 'Nails Course',
    image: nailCourseImage,
    price: '₹25,000',
    duration: '1 Month',
    category: 'Nail Art & Extensions',
    rating: '4.8',
    students: '60+',
    certified: true,
    description: 'Learn professional nail styling, nail art and extension techniques with practical training sessions designed for aspiring nail artists.',
    featured: false,
    learningPoints: [
      'Nail Preparation',
      'Gel Extensions',
      'Acrylic Nails',
      'Nail Art Basics',
      'Nail Finishing',
      'Nail Care',
      'Client Handling',
      'Practice Sessions'
    ],
    includes: [
      'Practical Learning',
      'Nail Kit Exposure',
      'Certification',
      'Extension Techniques',
      'Salon Environment',
      'Hands-on Practice'
    ]
  },
  {
    id: 'hair-course',
    title: 'Hair Course',
    image: hairCourseImage,
    price: '₹50,000',
    duration: '2 Months',
    category: 'Hair Styling & Treatments',
    rating: '4.8',
    students: '70+',
    certified: true,
    description: 'The Hair Course is created for learners who want to master professional hair styling, hair care, color basics and salon treatment techniques through guided practical training.',
    featured: false,
    learningPoints: [
      'Hair Wash & Blow Dry',
      'Hair Styling Basics',
      'Hair Spa Techniques',
      'Hair Treatment Knowledge',
      'Hair Color Basics',
      'Root Touch-Up Basics',
      'Global Color Understanding',
      'Hair Sectioning',
      'Client Consultation',
      'Salon Hygiene'
    ],
    includes: [
      'Practical Hair Training',
      'Styling Practice',
      'Treatment Demonstrations',
      'Product Knowledge',
      'Certification',
      'Salon Exposure',
      'Beginner to Professional Guidance',
      'Client Handling Practice'
    ]
  }
]

const features = [
  {
    id: 1,
    title: 'Professional Training',
    icon: GraduationCap,
    description: 'Learn from certified industry experts with years of practical experience.'
  },
  {
    id: 2,
    title: 'Industry Guidance',
    icon: TrendingUp,
    description: 'Get career guidance and placement support to grow in the beauty industry.'
  },
  {
    id: 3,
    title: 'Hands-on Practice',
    icon: Users,
    description: 'Work on real clients and models to build confidence and expertise.'
  },
  {
    id: 4,
    title: 'Certification Support',
    icon: Award,
    description: 'Receive recognized certifications to boost your professional credibility.'
  }
]

const timelineSteps = [
  { id: 1, title: 'Enroll', icon: CheckCircle },
  { id: 2, title: 'Training', icon: BookOpen },
  { id: 3, title: 'Practice', icon: Users },
  { id: 4, title: 'Certification', icon: Award },
  { id: 5, title: 'Professional Growth', icon: TrendingUp }
]

const Courses = () => {
  const navigate = useNavigate()
  const [coursesData, setCoursesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesService.getAll()
        setCoursesData(data.filter(c => c.status === 'Active'))
      } catch (error) {
        console.error("Failed to load courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const displayCourses = coursesData

  if (loading) {
    return (
      <div className="courses-page" style={{ paddingTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px', padding: '100px 5%' }}>
        <Skeleton className="skeleton-card" style={{ height: '50vh' }} />
        <Skeleton className="skeleton-title" style={{ width: '30%', margin: '0 auto' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {[1,2,3].map(n => <Skeleton key={n} className="skeleton-card" style={{ height: '400px' }} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <SEO
        title="Beauty Courses - Mehak Salon & Spa"
        description="Join our professional beauty courses. Learn makeup, hair styling, nail art, and more from industry experts."
        image="https://mehaksalonandspa.in/og-image.jpg"
        url="https://mehaksalonandspa.in/courses"
      />
      {/* Hero Section */}
      <section className="courses-hero">
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
              <span className="hero-badge">Professional Beauty Academy</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-heading"
            >
              Transform Passion Into Profession
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-subheading"
            >
              Join our beauty and grooming programs designed to help you master industry skills with professional guidance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hero-buttons"
            >
              <button className="cta-button primary" onClick={() => navigate('/courses')}>Explore Courses</button>
              <button className="cta-button secondary" onClick={() => window.open(createWhatsAppLink({ type: 'course', name: 'Premium Beauty Courses' }), '_blank', 'noopener,noreferrer')}>Enroll Now</button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-right"
          >
            <div className="hero-image-card">
              <img
                src={premiumAcademyImage}
                alt="Mehak Salon & Spa Premium Academy training space"
                className="courses-hero-image"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Showcase Section */}
      <section className="luxury-showcase-section">
        <div className="luxury-bg-glow glow-left"></div>
        <div className="luxury-bg-glow glow-right"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="luxury-showcase-header"
        >
          <h2 className="luxury-showcase-title">OUR PROFESSIONAL COURSES</h2>
          <div className="luxury-title-accent"></div>
          <p className="luxury-showcase-subtitle">Premium beauty programs designed for aspiring professionals and beauty enthusiasts.</p>
        </motion.div>

        <div className="luxury-courses-grid">
          {displayCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`luxury-course-card ${course.featured ? 'luxury-featured-card' : 'luxury-standard-card'} pos-${(index % 5) + 1}`}
            >
              <div className="luxury-card-image">
                <img
                  src={course.image || course.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'}
                  alt={course.title || course.name}
                  className="luxury-course-image"
                  loading="lazy"
                />
                {course.featured && <span className="luxury-featured-badge"><Sparkles size={14}/> Best Seller</span>}
                <span className="luxury-category-badge">{course.category}</span>
                <div className="luxury-card-overlay"></div>
              </div>
              
              <div className="luxury-card-content">
                <div className="luxury-card-header">
                  <div className="luxury-rating-box">
                    <Star size={16} fill="#C6A16E" color="#C6A16E" />
                    <span className="rating-val">{course.rating || '5.0'}</span>
                    <span className="rating-students">({course.enrolledCount || course.students || '0'} enrolled)</span>
                  </div>
                </div>
                
                <h3 className="luxury-course-title">{course.title || course.name}</h3>
                <p className="luxury-course-desc">{course.description}</p>
                
                <div className="luxury-card-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  {(course.certified || true) && (
                    <div className="meta-item">
                      <Shield size={16} />
                      <span>Certified</span>
                    </div>
                  )}
                </div>
                
                <div className="luxury-card-footer">
                  <div className="luxury-price">
                    {typeof course.price === 'string' ? course.price : `₹${course.price}`}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="luxury-enroll-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(createWhatsAppLink({ type: 'course', name: course.title || course.name, price: course.price }), '_blank', 'noopener,noreferrer')
                    }}
                  >
                    Enroll Now
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Learn With Us Section */}
      <section className="why-learn-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="why-learn-header"
        >
          <h2 className="why-learn-title">Why Choose Mehak Academy</h2>
          <p className="why-learn-subtitle">Experience premium beauty education with industry-leading expertise.</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="feature-card"
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Journey Timeline */}
      <section className="learning-journey">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="journey-header"
        >
          <h2 className="journey-title">Your Learning Journey</h2>
          <p className="journey-subtitle">A clear path from enrollment to professional success.</p>
        </motion.div>

        <div className="timeline-container">
          {timelineSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="timeline-step"
            >
              <div className="timeline-icon">
                <step.icon size={24} />
              </div>
              <div className="timeline-content">
                <span className="step-number">Step {step.id}</span>
                <h3 className="step-title">{step.title}</h3>
              </div>
              {index < timelineSteps.length - 1 && <div className="timeline-connector"></div>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="premium-cta">
        <div className="cta-background">
          <img src={ctaBackgroundImage} alt="Academy Background" />
          <div className="cta-overlay"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="cta-content"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cta-icon"
          >
            <Sparkles size={48} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="cta-title"
          >
            Start Your Beauty Journey Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cta-subtitle"
          >
            Learn, practice and grow with professional beauty education.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="cta-buttons"
          >
            <button className="cta-button primary" onClick={() => window.open(createWhatsAppLink({ type: 'course', name: 'Professional Training Program' }), '_blank', 'noopener,noreferrer')}>Enroll Now</button>
            <button className="cta-button secondary" onClick={() => navigate('/contact')}>Contact Us</button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default Courses
