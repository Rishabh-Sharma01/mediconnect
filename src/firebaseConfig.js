
import { initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHQkyj6edKitvHncbQYmxPlOSwftZ1hUo",
  authDomain: "mediconnect-ee44e.firebaseapp.com",
  projectId: "mediconnect-ee44e",
  storageBucket: "mediconnect-ee44e.appspot.com",
  messagingSenderId: "681366660773",
  appId: "1:681366660773:web:73161584628159af530f4c",
  measurementId: "G-P13LJ25ZZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDatabase = getFirestore(app);

export default firestoreDatabase;