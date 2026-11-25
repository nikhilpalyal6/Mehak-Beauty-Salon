import { createFirestoreService } from './firestoreServiceFactory';

const seasonalOffersService = createFirestoreService('seasonalOffers');

// Custom function to clear all seasonal offers
const clearAllSeasonalOffers = async () => {
  const allOffers = await seasonalOffersService.getAll();
  for (const offer of allOffers) {
    await seasonalOffersService.remove(offer.id);
  }
  return { success: true, count: allOffers.length };
};

export default {
  ...seasonalOffersService,
  clearAllSeasonalOffers
};
