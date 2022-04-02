import firebase from '~/plugins/firebase'
import {child, get, getDatabase, ref} from "firebase/database";
import {
  getAuth, signInAnonymously, setPersistence, signInWithPopup,
  GoogleAuthProvider, browserLocalPersistence
} from "firebase/auth";

const db = getDatabase()
const dbRef = ref(db)

export const state = () => ({
  /**
   * ログインしているユーザー
   */
  user: {
    name: 'shun',
    email: '',
    country: '',
    subnational1: '',
    subnational2: '',
    subnational3: '',
    organization: '',
    title: '',
    uid: '',
    phoneNumber: ''
  },
  /**
   * 現在のシナリオid（各シナリオに10の食事パターンが存在）
   */
  scene: 'test',
  /**
   * ログイン状態のフラグ
   */
  isLoggedIn: false,
  /**
   * fctのテーブル用の値
   */
  fct: [],
  /**
   * driのテーブル用の値
   */
  dri: []
})
export const getters = {}
export const mutations = {
  /**
   * user.Uidを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateUserUid: function (state, payload) {
    state.user.uid = payload
  },
  /**
   * user.nameを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateUserName: function (state, payload) {
    state.user.name = payload
  },
  /**
   * fctを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateFct: function (state, payload) {
    state.fct = JSON.parse(JSON.stringify(payload))
  },
  /**
   * driを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateDri: function (state, payload) {
    state.dri = JSON.parse(JSON.stringify(payload))
  },
  /**
   * ログイン状態を更新
   * @param state
   * @param {boolean} payload ログイン状態
   */
  updateIsLoggedIn: function (state, payload) {
    state.isLoggedIn = payload
  }
}
export const actions = {
  /**
   * firebaseからデータを得てfctに代入
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async fireGetFct({commit, state}) {
    const path = state.user + '/dataset/'
    const dat = await get(child(dbRef, path + 'myFCT01')).catch((err) => {
      console.log(err)
    });
    if (!dat.exists()) {
      console.log('no data found')
    }
    commit('updateFct', dat)
  },
  /**
   * firebaseからデータを得てdriに代入
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async fireGetDri({commit, state}) {
    const path = state.user.name + '/dataset/'
    const dat = await get(child(dbRef, path + 'myDri04')).catch((err) => {
      console.log(err)
    });
    if (!dat.exists()) {
      console.log('no data found')
    }
    commit('updateDri', dat)
  },
  /**
   * ゲストログイン機能
   * @param commit
   * @returns {Promise<void>}
   */
  async loginGuest({commit}) {
    console.log('guest login action')
    const auth = await getAuth()

    await signInAnonymously(auth)
      .then((result) => {
        const user = result.user
        commit('updateUserUid', user.uid)
        commit('updateUserName', user.displayName)
        commit('updateIsLoggedIn', true)

        console.log('guest login success')
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        commit('updateIsLoggedIn', false)

        console.log('guest login error: ', errorCode, errorMessage)
      })

    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('guest keeping state')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('guest keeping state error: ', errorCode, errorMessage)
      })
  },
  /**
   * googleアカウントでのログイン
   * @param commit
   * @returns {Promise<void>}
   */
  async loginGoogle({commit}) {
    console.log('login action')
    const provider = new GoogleAuthProvider()
    const auth = await getAuth()

    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        //const token = credential.accessToken

        const user = result.user
        commit('updateUserUid', user.uid)
        commit('updateUserName', user.displayName)
        commit('updateIsLoggedIn', true)

        console.log('login success')
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        commit('updateIsLoggedIn', false)
        //const credential = GoogleAuthProvider.credentialFromError(error)

        console.log('login error: ', errorCode, errorMessage)
      })

    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('keeping state')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('keeping state error: ', errorCode, errorMessage)
      })
  },
  /**
   * ログイン状態を確認し、ログインされていればユーザー情報をstoreにセット
   * @param commit
   * @returns {Promise<unknown>}
   */
  async initFirebaseAuth({commit}){
    return new Promise((resolve) => {
      let unsubscribe = getAuth().onAuthStateChanged((user) => {
        if (user){
          commit('updateUserUid', user.uid)
          commit('updateUserName', user.displayName)
          commit('updateIsLoggedIn', true)
          console.log('onAuth true')
        } else {
          commit('updateUserUid', '')
          commit('updateUserName', '')
          commit('updateIsLoggedIn', false)
          console.log('onAuth false')
        }
        // user オブジェクトを resolve
        resolve(user);

        // 登録解除
        unsubscribe();
      });
    });
  }
}
