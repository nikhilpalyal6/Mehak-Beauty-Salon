import { createFirestoreService } from './firestoreServiceFactory';
const contentService = createFirestoreService('websiteContent');
export default contentService;
