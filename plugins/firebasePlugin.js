// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  initializeFirestore, CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence, doc, getDocFromCache, getDocFromServer, getDocs, collection
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * データベースの設定情報
 * @type {{storageBucket: string, apiKey: string, messagingSenderId:
 *     string, appId: string, projectId: string, databaseURL: string, authDomain: string}}
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDH_RkqtAD6I-MQIcSVFVWDeeGzZUPI2pw',
  authDomain: 'ifnaapp01.firebaseapp.com',
  databaseURL: 'https://ifnaapp01-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ifnaapp01',
  storageBucket: 'ifnaapp01.appspot.com',
  messagingSenderId: '419104702670',
  appId: '1:419104702670:web:94dc61759415cd134a909f'
}

/**
 * firebaseの初期化
 * @type {FirebaseApp}
 */
export const firebase = initializeApp(firebaseConfig)

/**
 * キャッシュサイズを最大化
 * @type {Firestore}
 */
const firestore = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
})

/**
 * オフラインキャッシュを有効化
 */
enableMultiTabIndexedDbPersistence(firestore)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log(
        '// Multiple tabs open, persistence can only be enabled ' +
        '            // in one tab at a a time. '
      )
    } else if (err.code === 'unimplemented') {
      console.log(
        '// The current browser does not support all of the' +
        '// features required to enable persistence'
      )
    }
    throw err
  })

// firestore.enablePersistence({synchronizeTabs:true})

export const firestoreDb = firestore

/**
 * fireStoreの初期化
 * @type {FirebaseStorage}
 */
export const storage = getStorage(firebase)

export async function fireGetDoc (collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from cache')
  const docSnap = await getDocFromCache(ref).catch(async () => {
    console.log('getData fail: no data in Cache. getData from fireBase')
    return await getDocFromServer(ref)
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Cache or Server')
    return ''
  }
}

export async function fireGetDocRemoteFirst (collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from server')
  const docSnap = await getDocFromServer(ref).catch(async () => {
    console.log('getData fail: no remote access. getData from local chache')
    return await getDocFromCache(ref)
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Cache or Server')
    return ''
  }
}

export async function fireGetDocRemoteOnly (collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from server')
  const docSnap = await getDocFromServer(ref).catch((err) => {
    console.error(err)
    throw new Error('getData fail: no internet access.')
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Server')
    return ''
  }
}

export async function getFileList (myCollection) {
  const res = []
  const querySnapshot = await getDocs(collection(firestoreDb, myCollection))
  querySnapshot.forEach((item) => {
    res.push(item.id)
  })
  return res
}
