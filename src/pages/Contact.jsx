import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './Contact.css';
import settingsService from '../services/settingsService';
import enquiriesService from '../services/enquiriesService';
import Skeleton from '../components/common/Skeleton';
import SEO from '../components/common/SEO';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

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
  }, []);

  const business = settings?.business || {
    address: 'X84C+X2 Dhariwal, Punjab, India',
    phone: '+91 7009482040',
    whatsapp: '+91 7009482040',
    email: 'Mehaksalon029@gmail.com',
    openingHours: 'Mon - Sun: 10:00 AM - 8:00 PM'
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log(`Field updated: ${id} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log current form data
    console.log('Form data on submit:', formData);
    
    // Validate form data with trimmed values
    const customerName = formData.customerName?.trim() || '';
    const email = formData.email?.trim() || '';
    const message = formData.message?.trim() || '';
    
    console.log('Validation check:', { customerName: !!customerName, email: !!email, message: !!message });
    
    if (!customerName || !email || !message) {
      console.log('Validation failed - showing error');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    try {
      setSubmitting(true);
      const enquiryData = {
        customerName: customerName,
        email: email,
        phone: (formData.phone?.trim()) || 'Not provided',
        service: (formData.service?.trim()) || 'General Inquiry',
        message: message,
        status: 'New',
        createdAt: new Date().toISOString()
      };

      console.log('Submitting enquiry:', enquiryData);
      await enquiriesService.create(enquiryData);
      console.log('Enquiry submitted successfully');
      
      // Reset form and show success message
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="contact-page" style={{ paddingTop: '100px', display: 'flex', gap: '40px', padding: '100px 5%' }}>
        <div style={{ flex: 1 }}>
          <Skeleton className="skeleton-card" style={{ height: '100px', marginBottom: '20px' }} />
          <Skeleton className="skeleton-card" style={{ height: '100px', marginBottom: '20px' }} />
          <Skeleton className="skeleton-card" style={{ height: '100px', marginBottom: '20px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton className="skeleton-card" style={{ height: '400px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <SEO
        title="Contact Us - Mehak Salon & Spa"
        description="Get in touch with Mehak Salon & Spa for appointments, inquiries, and more."
        image="https://mehaksalonandspa.in/og-image.jpg"
        url="https://mehaksalonandspa.in/contact"
      />
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-blob contact-blob-1"></div>
        <div className="contact-blob contact-blob-2"></div>
        <div className="contact-blob contact-blob-3"></div>
        
        <div className="contact-hero-content">
          <span className="hero-badge">Get in Touch</span>
          <h1>Contact Us</h1>
          <p className="hero-subheading">
            We'd love to hear from you. Book an appointment, ask us any questions, or simply drop by to say hello.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="contact-main">
        <div className="contact-container">
          
          {/* Info & Map Side */}
          <div className="contact-info-wrapper">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon-box">
                  <MapPin className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Visit Us</h3>
                  <p>{business.address}</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon-box">
                  <Phone className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Call Us</h3>
                  <p>{business.phone}<br/>{business.whatsapp && business.whatsapp !== business.phone ? business.whatsapp : ''}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box">
                  <Mail className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Email Us</h3>
                  <p>{business.email}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box">
                  <Clock className="info-icon" />
                </div>
                <div className="info-text">
                  <h3>Working Hours</h3>
                  <p>{business.openingHours}</p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe 
                src="https://maps.google.com/maps?q=X84C%2BX2%20Dhariwal%2C%20Punjab&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mehak Salon And Spa Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="contact-form-wrapper">
            <div className="form-header">
              <h2>Send a Message</h2>
              <p>Fill out the form below and we will get back to you shortly.</p>
            </div>
            
            {submitStatus && (
              <div className={`submit-message ${submitStatus}`}>
                <div className="message-content">
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Thank you! Your enquiry has been sent successfully. We'll get back to you soon.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} />
                      <span>Please fill in all required fields (Name, Email, Message).</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="customerName">Full Name</label>
                <input 
                  type="text" 
                  id="customerName" 
                  placeholder="Enter your full name" 
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service">Interested Service</label>
                <select 
                  id="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Select a service</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                  <option value="Hair Styling & Color">Hair Styling & Color</option>
                  <option value="Skin Care & Facials">Skin Care & Facials</option>
                  <option value="Nail Art & Extensions">Nail Art & Extensions</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  placeholder="How can we help you?" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={submitting}
              >
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="submit-icon" size={18} />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
