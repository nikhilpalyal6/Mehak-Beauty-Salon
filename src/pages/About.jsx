import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Droplets, ShieldCheck, HeartHandshake, Scissors, UserCheck, Star, Quote } from 'lucide-react';
import './About.css';
import contentService from '../services/contentService';
import galleryService from '../services/galleryService';
import testimonialsService from '../services/testimonialsService';
import Skeleton from '../components/common/Skeleton';
import SEO from '../components/common/SEO';

import premiumSalonSpace from '../assets/images/Premiumsalon space.png';
import relaxingSpaSession from '../assets/images/Relaxingspasession.webp';
import trainingSession from '../assets/images/Trainingsession.png';
import elegantBridalLook from '../assets/images/Elegant Bridal Look.png';
import premium2Image from '../assets/images/Premium2.png';

const premiumGradient = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0M2QTE2RTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyQzJDMkM7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4=';

const getValidImageUrl = (url, title) => {
  if (!url) return premiumGradient;
  const lowerUrl = url.toLowerCase();
  const lowerTitle = (title || '').toLowerCase();
  
  if (lowerUrl.includes('elegant') || lowerTitle.includes('elegant')) return elegantBridalLook;
  if (lowerUrl.includes('relaxing') || lowerTitle.includes('relaxing')) return relaxingSpaSession;
  if (lowerUrl.includes('training') || lowerTitle.includes('training')) return trainingSession;
  if (lowerUrl.includes('premium2') || lowerTitle.includes('premium2')) return premium2Image;
  if (lowerUrl.includes('salon') || lowerTitle.includes('salon')) return premiumSalonSpace;
  
  return url;
};

const About = () => {
  const [content, setContent] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // To ensure the page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Subscribe to real-time content updates
    const unsubscribe = contentService.subscribeToDocument('main', (contentData) => {
      if (contentData) {
        setContent(contentData);
      }
      setLoading(false);
    });

    // Fetch gallery and testimonials (not real-time for now)
    const fetchGalleryData = async () => {
      try {
        const [galleryData, testimonialsData] = await Promise.all([
          galleryService.getAll(),
          testimonialsService.getAll()
        ]);
        
        setGallery(galleryData);
        setTestimonials(testimonialsData.filter(t => t.status === 'Approved'));
      } catch (err) {
        console.error("Failed to load gallery data:", err);
      }
    };
    
    fetchGalleryData();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="about-page" style={{ paddingTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px', padding: '100px 5%' }}>
        <Skeleton className="skeleton-card" style={{ height: '50vh' }} />
        <Skeleton className="skeleton-title" style={{ width: '40%', margin: '0 auto' }} />
        <div style={{ display: 'flex', gap: '20px' }}>
          {[1,2,3].map(n => <Skeleton key={n} className="skeleton-card" style={{ height: '300px' }} />)}
        </div>
      </div>
    );
  }

  // Fallbacks
  const aboutContent = content?.about || {
    sectionBadge: 'Since 1997',
    heading: 'Redefining Beauty & Confidence Since 1997',
    description: 'An elegant sanctuary where artistry meets self-care. Step into a world of refined elegance. At Mehak Salon & Spa, we craft unforgettable beauty experiences tailored to unveil your most confident self.'
  };

  const fallbackTestimonials = [
    { customerName: 'Priya Sharma', serviceUsed: 'Bridal Makeup', rating: 5, text: 'Absolutely loved the bridal makeover experience. The team was professional, friendly and paid attention to every detail.' },
    { customerName: 'Simran Kaur', serviceUsed: 'Keratin Treatment', rating: 4.8, text: 'My hair became smooth, shiny and manageable. The staff was very polite and professional.' },
    { customerName: 'Neha Verma', serviceUsed: 'Nail Extensions', rating: 4.7, text: 'The nail extensions were beautiful and cleanly done. The finishing looked premium.' }
  ];
  
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const fallbackGallery = [
    { imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80', title: 'Salon Interior' },
    { imageUrl: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=600&q=80', title: 'Beauty Details' },
    { imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=600&q=80', title: 'Spa Experience' },
    { imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', title: 'Makeup Studio' }
  ];
  
  const displayGallery = gallery.length > 3 ? gallery : fallbackGallery;

  return (
    <div className="about-page">
      <SEO
        title="About Us - Mehak Salon & Spa"
        description="Learn about Mehak Salon & Spa, our premium beauty services, expert staff, and our luxurious space."
        image="https://mehaksalonandspa.in/og-image.jpg"
        url="https://mehaksalonandspa.in/about"
      />
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="hero-blur-blob blob-1"></div>
          <div className="hero-blur-blob blob-2"></div>
        </div>
        
        <div className="about-hero-container">
          <div className="hero-left-content">
            <span className="luxury-badge">{aboutContent.sectionBadge || 'About Us'}</span>
            <h1 className="hero-heading">{aboutContent.heading || 'Redefining Beauty & Confidence'}</h1>
            <p className="hero-intro">
              {aboutContent.description}
            </p>
            <div className="hero-cta-group">
              <Link to="/contact" className="premium-btn primary">
                Book Luxury Experience <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="premium-btn secondary">
                Explore Services
              </Link>
            </div>
          </div>
          
          <div className="hero-right-visuals">
            <div className="hero-image-wrapper primary-image">
              <img src={premium2Image} alt="Mehak Salon" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
            </div>
            <div className="hero-image-wrapper secondary-image">
              <img src={relaxingSpaSession} alt="Luxury Spa Setup" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
            </div>
            <div className="floating-card experience-card">
              <Sparkles className="icon-gold" size={24} />
              <div className="card-text">
                <strong>25+ Years</strong>
                <span>Of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER STORY SECTION */}
      <section className="founder-story">
        <div className="founder-container">
          <div className="founder-image-col">
            <div className="founder-portrait-wrapper">
              <img src={premiumSalonSpace} alt="Neeraj Bala - Founder" className="founder-img" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
              <div className="glass-card founder-label">
                <span className="name">Neeraj Bala</span>
                <span className="title">Founder & Beauty Expert</span>
              </div>
            </div>
          </div>
          <div className="founder-content-col">
            <div className="elegant-divider"></div>
            <h2 className="section-title">The Visionary Behind the Beauty</h2>
            <p className="story-text">
              What began in 1997 as a small endeavor has blossomed into Dhariwal's most trusted luxury beauty destination. Neeraj Bala’s passion for artistry and genuine care forms the soul of our salon. 
            </p>
            <div className="founder-quote">
              <Quote className="quote-icon" size={40} />
              <blockquote>
                "True beauty is not just about how you look, but how you feel when you step out of our doors. We don't just transform appearances; we nurture confidence."
              </blockquote>
              <div className="signature">Neeraj Bala</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT MEHAK SALON SECTION */}
      <section className="about-salon">
        <div className="about-salon-container">
          <div className="about-masonry-gallery">
            <img src={premiumSalonSpace} alt="Salon Interior" className="masonry-img img-1" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
            <img src={relaxingSpaSession} alt="Spa Ambience" className="masonry-img img-2" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
            <img src={elegantBridalLook} alt="Beauty Treatment" className="masonry-img img-3" onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }} style={{ objectFit: 'cover' }} />
          </div>
          
          <div className="about-text-content">
            <div className="content-block">
              <h3 className="block-title">Beauty Beyond Appearance</h3>
              <p>We believe that self-care is an essential ritual. Every treatment is designed to restore balance, uplift your spirit, and bring out your natural radiance.</p>
            </div>
            <div className="content-block">
              <h3 className="block-title">A Space Designed For Confidence & Care</h3>
              <p>Our elegant interiors and serene ambience provide an escape from the ordinary. Let our expert team pamper you in a hygienic, relaxing environment.</p>
            </div>
            <div className="content-block">
              <h3 className="block-title">Luxury Beauty Experience</h3>
              <p>From premium imported products to modern styling techniques, we ensure that every moment you spend here feels profoundly special.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="why-choose-us">
        <div className="section-header center">
          <span className="sub-tag">The Mehak Standard</span>
          <h2 className="section-title">Why We Are Different</h2>
        </div>
        <div className="features-grid">
          {[
            { icon: <UserCheck size={32} />, title: 'Skilled Experts', desc: 'Highly trained professionals dedicated to their craft.' },
            { icon: <HeartHandshake size={32} />, title: 'Personalized Care', desc: 'Consultations tailored to your unique beauty needs.' },
            { icon: <ShieldCheck size={32} />, title: 'Hygienic Environment', desc: 'Strict sterilization protocols for your safety.' },
            { icon: <Droplets size={32} />, title: 'Premium Products', desc: 'We only use top-tier, skin-friendly global brands.' },
            { icon: <Scissors size={32} />, title: 'Modern Techniques', desc: 'Always updated with the latest beauty trends.' },
            { icon: <Star size={32} />, title: 'Affordable Luxury', desc: 'An opulent experience that remains accessible.' }
          ].map((feature, idx) => (
            <div className="feature-card glass-card" key={idx}>
              <div className="icon-wrapper">{feature.icon}</div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section className="about-gallery">
        <div className="section-header center">
          <h2 className="section-title">Step Inside Our World</h2>
          <p className="section-desc">Experience the luxurious ambience of Mehak Salon.</p>
        </div>
        <div className="premium-gallery-grid">
          {displayGallery.slice(0, 4).map((item, idx) => {
            const classes = ['gallery-card large', 'gallery-card medium', 'gallery-card medium', 'gallery-card wide'];
            return (
              <div className={classes[idx]} key={idx}>
                <img 
                  src={getValidImageUrl(item.imageUrl || fallbackGallery[idx]?.imageUrl, item.title || fallbackGallery[idx]?.title)} 
                  alt={item.title || fallbackGallery[idx]?.title || 'Gallery Image'} 
                  onError={(e) => { e.target.onerror = null; e.target.src = premiumGradient; }}
                  style={{ objectFit: 'cover' }}
                />
                <div className="gallery-overlay">
                  <h3 className="gallery-title">{item.title || fallbackGallery[idx].title}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. TESTIMONIAL SECTION */}
      <section className="testimonial-section">
        <div className="section-header center">
          <h2 className="section-title">Words of Love</h2>
        </div>
        <div className="premium-testimonial-carousel">
          {displayTestimonials.slice(0, 3).map((review, idx) => (
            <div className="premium-testimonial-card glass-card" key={idx}>
              <div className="pt-header">
                <div className="pt-avatar">
                   {review.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="pt-info">
                  <h4>{review.customerName}</h4>
                  <span className="pt-service">{review.serviceUsed || review.service || 'Beauty Service'}</span>
                </div>
              </div>
              <div className="pt-stars">
                {[...Array(Math.floor(review.rating || 5))].map((_, i) => (
                  <Star key={i} size={16} fill="var(--about-accent-gold)" color="var(--about-accent-gold)" />
                ))}
              </div>
              <p className="pt-review">"{review.text || review.review}"</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
