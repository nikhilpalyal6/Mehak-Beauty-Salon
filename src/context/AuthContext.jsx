import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function reauthenticate(password) {
    if (!currentUser || !currentUser.email) throw new Error('No user logged in');
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    return reauthenticateWithCredential(currentUser, credential);
  }

  function updateUserEmail(email) {
    if (!currentUser) throw new Error('No user logged in');
    // Using verifyBeforeUpdateEmail is safer and often required by Firebase now
    return verifyBeforeUpdateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    if (!currentUser) throw new Error('No user logged in');
    return updatePassword(currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    reauthenticate,
    updateUserEmail,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
