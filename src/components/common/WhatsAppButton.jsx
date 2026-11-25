import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import settingsService from '../../services/settingsService'
import './WhatsAppButton.css'

const WhatsAppButton = () => {
  const [phoneNumber, setPhoneNumber] = useState('917009482040')
  const message = 'Hello! I would like to inquire about your services.'

  useEffect(() => {
    // Subscribe to real-time settings updates
    const unsubscribe = settingsService.subscribeToDocument('main', (data) => {
      if (data?.business?.phone) {
        const phoneDigits = data.business.phone.replace(/\D/g, '')
        const formattedPhone = phoneDigits.startsWith('91') ? phoneDigits : '91' + phoneDigits
        setPhoneNumber(formattedPhone)
      }
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [])

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button className="whatsapp-button" onClick={handleClick} aria-label="Contact on WhatsApp">
      <MessageCircle size={28} />
    </button>
  )
}

export default WhatsAppButton
