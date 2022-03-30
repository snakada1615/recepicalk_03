import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH_RkqtAD6I-MQIcSVFVWDeeGzZUPI2pw",
  authDomain: "ifnaapp01.firebaseapp.com",
  databaseURL: "https://ifnaapp01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ifnaapp01",
  storageBucket: "ifnaapp01.appspot.com",
  messagingSenderId: "419104702670",
  appId: "1:419104702670:web:94dc61759415cd134a909f"
};

const firebase = initializeApp(firebaseConfig);
//const db = getFirestore(app);

export default firebase
