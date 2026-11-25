import { createFirestoreService } from './firestoreServiceFactory';
const packagesService = createFirestoreService('packages');
export default packagesService;
