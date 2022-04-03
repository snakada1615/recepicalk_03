// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app"
import {initializeFirestore, CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDH_RkqtAD6I-MQIcSVFVWDeeGzZUPI2pw",
  authDomain: "ifnaapp01.firebaseapp.com",
  databaseURL: "https://ifnaapp01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ifnaapp01",
  storageBucket: "ifnaapp01.appspot.com",
  messagingSenderId: "419104702670",
  appId: "1:419104702670:web:94dc61759415cd134a909f"
};

export const firebase = initializeApp(firebaseConfig);
const firestore = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});
/**
 * オフラインキャッシュを有効化
 */
//enableIndexedDbPersistence(firestore)
enableMultiTabIndexedDbPersistence(firestore)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log(
        "// Multiple tabs open, persistence can only be enabled " +
        "            // in one tab at a a time. "
      )
    } else if (err.code === 'unimplemented') {
      console.log(
        "// The current browser does not support all of the" +
        "// features required to enable persistence"
      )
    }
    throw err
  });
//firestore.enablePersistence({synchronizeTabs:true})

export const firestoreDb = firestore
