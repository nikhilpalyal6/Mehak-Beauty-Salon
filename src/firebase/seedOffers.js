import { db } from './firebaseConfig.js';
import { collection, writeBatch, doc, getDocs, query, where } from 'firebase/firestore';
import { initialOffers } from '../data/admin/offersData.js';

export const seedOffers = async () => {
  console.log('seedOffers: Disabled - Admin should create offers through UI');
  return { success: true, message: 'Offers seeding is disabled. Admin should create offers through UI.' };
  
  /* DISABLED - Do not auto-seed offers
  console.log('Starting offers seed...');
  
  try {
    // Check if offers collection already has data
    const offersRef = collection(db, 'offers');
    const snapshot = await getDocs(offersRef);
    
    if (!snapshot.empty) {
      console.log('Offers collection already has data. Skipping seed.');
      return { success: true, message: 'Offers collection already populated.' };
    }

    const batch = writeBatch(db);

    // Add initial offers
    initialOffers.forEach((offer) => {
      const docRef = doc(collection(db, 'offers'));
      batch.set(docRef, offer);
    });

    await batch.commit();
    console.log('Offers seeded successfully!');
    return { success: true, message: 'Offers seeded successfully!' };
  } catch (error) {
    console.error('Error seeding offers:', error);
    return { success: false, message: error.message };
  }
  */
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedOffers().then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}
