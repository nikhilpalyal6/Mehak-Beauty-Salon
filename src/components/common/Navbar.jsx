import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/logo/logo2.png'
import settingsService from '../../services/settingsService'
import { createWhatsAppLink } from '../../utils/whatsapp'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('+917009482040')

  useEffect(() => {
    // Subscribe to real-time settings updates
    const unsubscribe = settingsService.subscribeToDocument('main', (data) => {
      if (data?.business?.phone) {
        const phoneDigits = data.business.phone.replace(/\D/g, '')
        const formattedPhone = phoneDigits.startsWith('91') ? phoneDigits : '91' + phoneDigits
        setWhatsappNumber(formattedPhone)
        window.__SALON_WHATSAPP_NUMBER__ = formattedPhone
      }
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const whatsappLink = createWhatsAppLink({ type: 'general', phone: whatsappNumber })

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Mehak Salon And Spa" className="logo-image" />
        </div>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/gallery">Gallery</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/courses">Courses</a></li>
          <li><a href="/contact">Contact</a></li>
          <li className="navbar-cta"><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="book-button">Book Appointment</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
