import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSPgNIckWmKKE5eHs8uzNVsFmDYlQEGIM",
  authDomain: "gihary-corecell.firebaseapp.com",
  projectId: "gihary-corecell",
  storageBucket: "gihary-corecell.firebasestorage.app",
  messagingSenderId: "1042422793174",
  appId: "1:1042422793174:web:11134e36e5a28d5908da77",
  measurementId: "G-PD1193HT4T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
