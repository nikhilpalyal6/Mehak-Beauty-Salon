import { createFirestoreService } from './firestoreServiceFactory';
const settingsService = createFirestoreService('settings');
export default settingsService;
