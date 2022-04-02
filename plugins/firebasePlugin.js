// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

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

export default firebase
