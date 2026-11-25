import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

const quickOffersData = [
  { title: 'Only Clean Up', price: 150, iconType: 'Scissors', status: 'Active', displayOrder: 1 },
  { title: 'Full Facial', price: 450, iconType: 'Droplet', status: 'Active', displayOrder: 2 },
  { title: 'Wax Full Arms', price: 200, iconType: 'Sparkles', status: 'Active', displayOrder: 3 },
  { title: 'Wax Full Legs', price: 400, iconType: 'Sparkles', status: 'Active', displayOrder: 4 },
  { title: 'Manicure + Pedicure', price: 500, iconType: 'Crown', status: 'Active', displayOrder: 5 }
];

const packagesData = [
  { name: 'Essential Glow', price: 599, services: ['Bleach', 'Facial', 'Full Threading'], popular: false, status: 'Active', displayOrder: 1 },
  { name: 'Radiance Package', price: 799, services: ['Bleach', 'Facial', 'D-Tan', 'Anti-aging', 'Whitening', 'Headwash', 'Full Threading'], popular: true, status: 'Active', displayOrder: 2 },
  { name: 'Luxury Spa', price: 1199, services: ['Bleach', 'Biotique', 'Cosmixia', 'Manicure', 'Pedicure', 'Threading'], popular: false, status: 'Active', displayOrder: 3 },
  { name: 'Ultimate Pamper', price: 1799, services: ['Bleach', 'O3 Facial', 'Biotique Treatment Facial', 'Hydrox', 'Full Arms Wax', 'Manicure / Pedicure', 'Headwash', 'Full Threading'], popular: false, status: 'Active', displayOrder: 4 }
];

const hairOffersData = [
  { name: 'Head Wash Shoulder Length', detail: '', price: 100, status: 'Active', displayOrder: 1 },
  { name: 'Head Wash Long Length', detail: '', price: 150, status: 'Active', displayOrder: 2 },
  { name: 'Hair Spa', detail: '', price: 400, status: 'Active', displayOrder: 3 },
  { name: 'Treatment Hair Spa', detail: '', price: 999, status: 'Active', displayOrder: 4 },
  { name: 'Smoothing / Rebonding', detail: 'Mid Length', price: 3000, status: 'Active', displayOrder: 5 },
  { name: 'Keratin', detail: 'Mid Length', price: 2500, status: 'Active', displayOrder: 6 },
  { name: 'Mano Plastia', detail: 'Mid Length', price: 3999, status: 'Active', displayOrder: 7 },
  { name: 'Botox Treatment', detail: 'Mid Length', price: 3499, status: 'Active', displayOrder: 8 },
  { name: 'Hair Cutting', detail: '', price: 299, status: 'Active', displayOrder: 9 },
  { name: 'Global Hair Color', detail: '', price: 1799, status: 'Active', displayOrder: 10 },
  { name: 'Highlights / Streak', detail: '', price: 150, status: 'Active', displayOrder: 11 },
  { name: 'Root Touch Up', detail: '', price: 500, status: 'Active', displayOrder: 12 }
];

const regularServicesData = [
  // Face & Skin
  { name: 'Face Bleach', category: 'Face & Skin', price: 100, status: 'Active', displayOrder: 1 },
  { name: 'Basic Bleach', category: 'Face & Skin', price: 150, status: 'Active', displayOrder: 2 },
  { name: 'Clean Up', category: 'Face & Skin', price: 250, status: 'Active', displayOrder: 3 },
  { name: 'Basic Facial', category: 'Face & Skin', price: 700, status: 'Active', displayOrder: 4 },
  { name: 'Skin Tightening Facial', category: 'Face & Skin', price: 1200, status: 'Active', displayOrder: 5 },
  { name: 'D-Tan Treatment', category: 'Face & Skin', price: 800, status: 'Active', displayOrder: 6 },
  { name: 'Lotus Facial', category: 'Face & Skin', price: 1500, status: 'Active', displayOrder: 7 },
  { name: 'Biotique Facial', category: 'Face & Skin', price: 1500, status: 'Active', displayOrder: 8 },
  { name: 'Biotique Treatment Facial', category: 'Face & Skin', price: 2500, status: 'Active', displayOrder: 9 },
  { name: 'Potli Facial with Hydra', category: 'Face & Skin', price: 3500, status: 'Active', displayOrder: 10 },
  
  // Threading
  { name: 'Full Face Threading', category: 'Threading', price: 60, status: 'Active', displayOrder: 11 },
  
  // Waxing & Body Care
  { name: 'Full Arms Wax', category: 'Waxing & Body Care', price: 300, status: 'Active', displayOrder: 12 },
  { name: 'Full Legs Wax', category: 'Waxing & Body Care', price: 500, status: 'Active', displayOrder: 13 },
  { name: 'Full Body Wax', category: 'Waxing & Body Care', price: 3500, status: 'Active', displayOrder: 14 },
  { name: 'Body Polishing', category: 'Waxing & Body Care', price: 1500, status: 'Active', displayOrder: 15 },
  
  // Hands & Feet
  { name: 'Basic Manicure / Pedicure', category: 'Hands & Feet', price: 800, status: 'Active', displayOrder: 16 },
  { name: 'Premium Manicure / Pedicure', category: 'Hands & Feet', price: 1500, status: 'Active', displayOrder: 17 },
  
  // Nails
  { name: 'Full Tip Nail Extensions', category: 'Nails', price: 1000, status: 'Active', displayOrder: 18 },
  { name: 'Gel Nail Extensions', category: 'Nails', price: 1500, status: 'Active', displayOrder: 19 },
  { name: 'Acrylic Nails', category: 'Nails', price: 2500, status: 'Active', displayOrder: 20 },
  { name: 'Gel Nail Paint (Hands Only)', category: 'Nails', price: 500, status: 'Active', displayOrder: 21 },
  
  // Hair Treatments
  { name: 'Smoothing (Mid Length)', category: 'Hair Treatments', price: 3500, status: 'Active', displayOrder: 22 },
  { name: 'Keratin (Mid Length)', category: 'Hair Treatments', price: 2500, status: 'Active', displayOrder: 23 },
  { name: 'Botoliss Treatment', category: 'Hair Treatments', price: 5000, status: 'Active', displayOrder: 24 },
  { name: 'K9 Botox Treatment', category: 'Hair Treatments', price: 4000, status: 'Active', displayOrder: 25 },
  { name: 'Nanoplasty Treatment', category: 'Hair Treatments', price: 4000, status: 'Active', displayOrder: 26 },
  { name: 'Basic Hair Spa', category: 'Hair Treatments', price: 800, status: 'Active', displayOrder: 27 },
  { name: 'Shea Hair Filler Treatment', category: 'Hair Treatments', price: 1500, status: 'Active', displayOrder: 28 },
  { name: 'Kanpeki Hair Ritual Therapy', category: 'Hair Treatments', price: 1800, status: 'Active', displayOrder: 29 },
  { name: 'Hair Scalp Treatment', category: 'Hair Treatments', price: 1200, status: 'Active', displayOrder: 30 },

  // Hair Color
  { name: 'Root Touch-Up Hair Color', category: 'Hair Color', price: '₹500 / ₹800', status: 'Active', displayOrder: 31 },
  { name: 'Global Hair Color', category: 'Hair Color', price: 2500, status: 'Active', displayOrder: 32 },
  { name: 'Highlights (Per Foil)', category: 'Hair Color', price: 250, status: 'Active', displayOrder: 33 },
  { name: 'Fashion Shade Color', category: 'Hair Color', price: '3000+', status: 'Active', displayOrder: 34 }
];

const servicesPageContent = {
  id: 'main',
  heroBadge: 'Limited Time Offer',
  heroHeading: 'Special Summer Beauty Offers',
  heroSubtitle: 'Enjoy premium salon, facial, waxing, hair and care packages at exclusive seasonal prices.',
  offerDate: '15 May – 30 May',
  primaryButtonText: 'Book Offer Now',
  heroBgUrl: '',
  heroBgPublicId: ''
};

export const seedServicesData = async () => {
  console.log('Starting Services Page data seed...');

  const clearCollection = async (collectionName) => {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared ${collectionName}`);
  };

  try {
    // 1. Clear existing
    await clearCollection('quickOffers');
    await clearCollection('packages');
    await clearCollection('hairOffers');
    await clearCollection('regularServices');

    // 2. Add quickOffers
    for (const item of quickOffersData) {
      await addDoc(collection(db, 'quickOffers'), item);
    }
    console.log('Seeded quickOffers');

    // 3. Add packages
    for (const item of packagesData) {
      await addDoc(collection(db, 'packages'), item);
    }
    console.log('Seeded packages');

    // 4. Add hairOffers
    for (const item of hairOffersData) {
      await addDoc(collection(db, 'hairOffers'), item);
    }
    console.log('Seeded hairOffers');

    // 5. Add regularServices
    for (const item of regularServicesData) {
      await addDoc(collection(db, 'regularServices'), item);
    }
    console.log('Seeded regularServices');

    // 6. Set servicesPageContent singleton
    await setDoc(doc(db, 'servicesPageContent', 'main'), servicesPageContent);
    console.log('Seeded servicesPageContent');

    console.log('Successfully seeded all services page data!');
  } catch (err) {
    console.error('Error seeding services data:', err);
  }
};
