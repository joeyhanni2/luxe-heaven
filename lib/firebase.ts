import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD70S7xe7lmOSuDj3S7m6RlEvtzqYTf4m4",
  authDomain: "luxe-heaven.firebaseapp.com",
  projectId: "luxe-heaven",
  storageBucket: "luxe-heaven.firebasestorage.app",
  messagingSenderId: "831325804836",
  appId: "1:831325804836:web:374d42db16bcac31377bb1",
  measurementId: "G-P7H6PP1MLG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();