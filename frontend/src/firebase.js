import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "stackoverflow-1ba38.firebaseapp.com",
  projectId: "stackoverflow-1ba38",
  storageBucket: "stackoverflow-1ba38.appspot.com",
  messagingSenderId: "785675809985",
  appId: "1:785675809985:web:86420d6b2dbab712b49040",
  measurementId: "G-M8VM3HCVGG"
};

const firebaseApp = initializeApp(firebaseConfig);
// const db = firebaseApp.firestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };
// export default db;
