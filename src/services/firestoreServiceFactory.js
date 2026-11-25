import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const createFirestoreService = (collectionName) => {
  const colRef = collection(db, collectionName);

  const getAll = async () => {
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const getById = async (id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  };

  const create = async (data) => {
    // If data has an id, use setDoc instead of addDoc (useful for settings/content or seed)
    if (data.id) {
      const docRef = doc(db, collectionName, data.id.toString());
      await setDoc(docRef, data);
      return { ...data, id: data.id.toString() };
    }
    
    const docRef = await addDoc(colRef, data);
    return { ...data, id: docRef.id };
  };

  const update = async (id, data) => {
    const docRef = doc(db, collectionName, id.toString());
    await updateDoc(docRef, data);
    return { ...data, id: id.toString() };
  };

  const remove = async (id) => {
    const docRef = doc(db, collectionName, id.toString());
    await deleteDoc(docRef);
    return id.toString();
  };

  // Real-time listener for entire collection
  const subscribeToAll = (callback) => {
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.error('Real-time listener error:', error);
      callback([]);
    });
    return unsubscribe;
  };

  // Real-time listener for a specific document
  const subscribeToDocument = (id, callback) => {
    const docRef = doc(db, collectionName, id.toString());
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Real-time listener error:', error);
      callback(null);
    });
    return unsubscribe;
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    subscribeToAll,
    subscribeToDocument
  };
};
