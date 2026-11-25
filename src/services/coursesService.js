import { createFirestoreService } from './firestoreServiceFactory';
const coursesService = createFirestoreService('courses');
export default coursesService;
