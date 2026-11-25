import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Instagram,
  Facebook,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import logo from '../../assets/logo/logo2.png'
import settingsService from '../../services/settingsService'
import './Footer.css'

const easeLuxury = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeLuxury },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
}

const exploreLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

const serviceLinks = [
  { label: 'Bridal Makeup', to: '/services' },
  { label: 'Spa Therapy', to: '/services' },
  { label: 'Hair Styling', to: '/services' },
  { label: 'Skin Care', to: '/services' },
  { label: 'Beauty Courses', to: '/courses' },
]


const Footer = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to real-time settings updates
    const unsubscribe = settingsService.subscribeToDocument('main', (data) => {
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [])

  const business = settings?.business || {
    phone: '+91 7009482040',
    email: 'Mehaksalon029@gmail.com',
    address: 'Dist. Gurdaspur, Dadwan Road Dhariwal, Near DAV High School',
    openingHours: '9:00 AM – 8:00 PM'
  }

  const contactItems = [
    { icon: Phone, text: business.phone, href: `tel:${business.phone?.replace(/\s/g, '')}` },
    { icon: Mail, text: business.email, href: `mailto:${business.email}` },
    { icon: MapPin, text: business.address, href: null },
  ]

  const hoursItems = [
    { day: 'Monday – Sunday', time: business.openingHours },
  ]

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/mehaksalondhariwal/' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${business.phone?.replace(/[^\d]/g, '')}` },
  ]
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__body">
        <motion.div
          className="site-footer__main"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <motion.div className="site-footer__brand" variants={fadeUp}>
            <Link to="/" className="site-footer__logo-link">
              <img
                src={logo}
                alt="Mehak Salon & Spa"
                className="site-footer__logo"
              />
            </Link>
            <p className="site-footer__tagline">
              A sanctuary of refined beauty and wellness—where artistry meets
              calm, and every visit feels effortlessly luxurious.
            </p>
            <motion.div
              className="site-footer__social"
              variants={fadeUp}
              role="list"
              aria-label="Social media"
            >
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="site-footer__social-btn"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="site-footer__columns"
            variants={staggerContainer}
          >
            <motion.nav
              className="site-footer__col"
              aria-label="Explore"
              variants={fadeUp}
            >
              <h3 className="site-footer__col-title">Explore</h3>
              <ul className="site-footer__col-list">
                {exploreLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="site-footer__col-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.nav
              className="site-footer__col"
              aria-label="Services"
              variants={fadeUp}
            >
              <h3 className="site-footer__col-title">Services</h3>
              <ul className="site-footer__col-list">
                {serviceLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="site-footer__col-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div className="site-footer__col" variants={fadeUp}>
              <h3 className="site-footer__col-title">Contact</h3>
              <ul className="site-footer__col-list site-footer__col-list--contact">
                {contactItems.map(({ icon: Icon, text, href }) => (
                  <li key={text}>
                    {href ? (
                      <a href={href} className="site-footer__contact-row">
                        <Icon size={15} strokeWidth={1.5} aria-hidden />
                        <span>{text}</span>
                      </a>
                    ) : (
                      <span className="site-footer__contact-row">
                        <Icon size={15} strokeWidth={1.5} aria-hidden />
                        <span>{text}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="site-footer__col" variants={fadeUp}>
              <h3 className="site-footer__col-title">Working Hours</h3>
              <ul className="site-footer__col-list site-footer__col-list--hours">
                {hoursItems.map(({ day, time }) => (
                  <li key={day} className="site-footer__hours-row">
                    <span className="site-footer__hours-day">{day}</span>
                    <span className="site-footer__hours-time">{time}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="site-footer__bar"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: easeLuxury, delay: 0.15 }}
        >
          <div className="site-footer__bar-inner">
            <p className="site-footer__copy">&copy; 2026 Mehak Salon &amp; Spa</p>
            <p className="site-footer__credit">Designed with elegance.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
