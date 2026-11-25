import { db } from './firebaseConfig.js';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { initialOffers } from '../data/admin/offersData.js';

// Dummy Data
const dummyServices = [
  { name: 'Bridal Makeup', category: 'Bridal', price: 15000, status: 'Active', description: 'Complete bridal makeup package including hair styling and draping.' },
  { name: 'Advanced Haircut', category: 'Hair', price: 1200, status: 'Active', description: 'Premium haircut by senior stylist.' },
  { name: 'Keratin Treatment', category: 'Hair', price: 4500, status: 'Active', description: 'Smoothing treatment for frizzy hair.' },
  { name: 'Gold Facial', category: 'Spa', price: 2500, status: 'Active', description: 'Luxury facial for glowing skin.' },
  { name: 'Basic Makeup Course', category: 'Courses', price: 30000, status: 'Inactive', description: '1 month basic makeup training.' }
];

const dummyCourses = [
  { name: 'Self Grooming Course', category: 'Personal Grooming', price: 15000, duration: '2 Weeks', rating: '4.8', enrolledCount: 124, status: 'Active', description: 'Master everyday makeup and styling for yourself.' },
  { name: 'Basic Beauty Course', category: 'Beauty Foundation', price: 35000, duration: '1 Month', rating: '4.9', enrolledCount: 86, status: 'Active', description: 'Fundamental beauty concepts and salon basics.' },
  { name: 'Advance Beauty Course', category: 'Professional Training', price: 65000, duration: '3 Months', rating: '5.0', enrolledCount: 42, status: 'Active', description: 'Comprehensive training for aspiring professionals.' },
  { name: 'Professional Nail Art', category: 'Nail Art & Extensions', price: 20000, duration: '3 Weeks', rating: '4.7', enrolledCount: 56, status: 'Inactive', description: 'Learn acrylics, gel extensions, and advanced 3D art.' },
  { name: 'Hair Chemical & Treatment', category: 'Hair Styling & Treatments', price: 45000, duration: '1.5 Months', rating: '4.8', enrolledCount: 71, status: 'Active', description: 'Specialized training in rebonding, coloring, and keratin.' }
];

const dummyGallery = [
  { title: 'Traditional Red Bridal Look', category: 'Bridal', imageUrl: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80', description: 'Classic red lehenga bridal makeup.' },
  { title: 'Sleek Bob Cut', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80', description: 'Modern sleek bob cut.' },
  { title: 'Subtle Party Makeup', category: 'Makeup', imageUrl: 'https://images.unsplash.com/photo-1512496015851-a1dc8a477e4f?auto=format&fit=crop&q=80', description: 'Soft glam party makeup.' },
  { title: 'Acrylic Extensions', category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80', description: 'Long acrylic nails with french tip.' }
];

const dummyOffers = initialOffers;

const dummyTestimonials = [
  { customerName: 'Sneha Patel', serviceUsed: 'Bridal Makeup', rating: 5, text: 'Absolutely loved my bridal look! The team was so professional and made me feel like a princess on my big day.', imageUrl: '', status: 'Approved', featured: true },
  { customerName: 'Rahul Verma', serviceUsed: 'Hair Styling', rating: 4, text: 'Great haircut. The stylist understood exactly what I wanted.', imageUrl: '', status: 'Approved', featured: false },
  { customerName: 'Anjali Desai', serviceUsed: 'Nail Art', rating: 5, text: 'My nails have never looked better! The acrylic extensions are perfect.', imageUrl: '', status: 'Approved', featured: true },
  { customerName: 'Priya Sharma', serviceUsed: 'Facial', rating: 5, text: 'Very relaxing experience. The glow facial gave me immediate results.', imageUrl: '', status: 'Pending', featured: false }
];

const dummyEnquiries = [
  { customerName: 'Amit Kumar', phone: '9876543210', service: 'Hair Styling', date: '2024-03-15', message: 'I would like to book a haircut for this Saturday.', status: 'New' },
  { customerName: 'Neha Gupta', phone: '8765432109', service: 'Bridal Makeup', date: '2024-03-14', message: 'Inquiring about bridal packages for a wedding in November.', status: 'Contacted' },
  { customerName: 'Vikram Singh', phone: '7654321098', service: 'Spa Therapy', date: '2024-03-12', message: 'Do you offer couples spa packages?', status: 'Completed' }
];

const dummyContent = {
  id: 'main',
  hero: { badgeText: 'Premium Beauty Services', mainHeading: 'Unveil Your True Beauty', subHeading: 'Experience luxury salon and spa services tailored just for you.', primaryButtonText: 'Book Appointment', secondaryButtonText: 'Our Services' },
  about: { sectionBadge: 'About Us', heading: 'Expert Care For You', description: 'With over 10 years of experience, our professional team is dedicated to providing the best beauty and wellness treatments.' },
  cta: { badgeText: 'Ready to Transform?', heading: 'Book Your Session Today', description: 'Join thousands of happy clients who trust us with their beauty needs.', buttonText: 'Contact Us Now' },
  contact: { phone: '+91 7009482040', whatsapp: '+91 7009482040', email: 'Mehaksalon029@gmail.com', openingHours: 'Mon-Sun: 10:00 AM - 8:00 PM', address: '123 Beauty Lane, Fashion District, City - 400001', mapLink: 'https://maps.google.com' }
};

const dummySettings = {
  id: 'main',
  business: { salonName: 'Mehak Salon And Spa', tagline: 'Your Beauty, Our Passion', phone: '+91 7009482040', whatsapp: '+91 7009482040', email: 'Mehaksalon029@gmail.com', address: '123 Beauty Lane, Fashion District, City - 400001', openingHours: 'Mon-Sun: 10:00 AM - 8:00 PM' },
  branding: { logoUrl: '', primaryColor: '#d4a373', accentColor: '#faedcd', footerText: '© 2024 Mehak Salon And Spa. All rights reserved.' },
  admin: { adminName: 'Admin', adminEmail: 'admin@mehaksalon.com', password: '' },
  website: { enableBooking: true, showOffers: true, showCourses: true, maintenanceMode: false }
};

export const seedDatabase = async () => {
  console.log('Starting database seed...');
  
  try {
    const batch = writeBatch(db);

    // Helper to add documents to batch
    const seedCollection = (collectionName, dataList) => {
      dataList.forEach((item) => {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, item);
      });
    };

    seedCollection('services', dummyServices);
    seedCollection('courses', dummyCourses);
    // seedCollection('gallery', dummyGallery); // DISABLED: Start with empty gallery
    // DISABLED: Do not auto-seed dummy offers. Admin should create offers through UI.
    // seedCollection('offers', dummyOffers);
    seedCollection('testimonials', dummyTestimonials);
    seedCollection('enquiries', dummyEnquiries);

    // Set 'main' documents for singletons
    const contentRef = doc(db, 'websiteContent', 'main');
    batch.set(contentRef, dummyContent);

    const settingsRef = doc(db, 'settings', 'main');
    batch.set(settingsRef, dummySettings);

    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
};
