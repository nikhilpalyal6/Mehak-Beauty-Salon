import { createFirestoreService } from './firestoreServiceFactory';
const baseService = createFirestoreService('servicesPageContent');

const servicesPageContentService = {
  getContent: () => baseService.getById('main'),
  updateContent: (data) => {
    return baseService.create({ id: 'main', ...data });
  },
  subscribe: (callback) => baseService.subscribeToDocument('main', callback)
};

export default servicesPageContentService;
