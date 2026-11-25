import { createFirestoreService } from './firestoreServiceFactory';
const servicesService = createFirestoreService('services');
export default servicesService;
