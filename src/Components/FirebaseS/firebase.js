import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCh0Zy4oESdqjtAC9IptErRM1Qmy4sJKdM",
  authDomain: "guesskodb.firebaseapp.com",
  projectId: "guesskodb",
  storageBucket: "guesskodb.firebasestorage.app",
  messagingSenderId: "154267857621",
  appId: "1:154267857621:web:d9f19fdb103929da07285c",
  measurementId: "G-32Q9VYPJCS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app;