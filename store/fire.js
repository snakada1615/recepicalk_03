//import firebase from '~/plugins/firebase'
import {
  getAuth, signInAnonymously, setPersistence, signInWithPopup,
  GoogleAuthProvider, browserLocalPersistence, signOut
} from "firebase/auth";
import {fireGetDoc} from "~/plugins/firebasePlugin";
//import {doc} from "firebase/firestore";
//import {firestoreDb} from "~/plugins/firebasePlugin";

function MenuItem(id, Group, Name, En, Pr, Va, Fe, Wt){
  this.id = id
  this.Group= Group
  this.Name= Name
  this.En= En
  this.Pr= Pr
  this.Va= Va
  this.Fe= Fe
  this.Wt= Wt
}
function Target(id, count){
  this.id = id
  this.count = count
}


export const state = () => ({
  myApp:{
    /**
     * 現在のユーザー
     */
    user: {
      name: '',
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
     * 利用するデータセット：fctとdri
     */
    dataSet:{
      /**
       * fctのid
       */
      fctId:'',
      /**
       * driのid
       */
      driId:'',
      /**
       * fctのデータ
       */
      fct:[],
      /**
       * driのデータ
       */
      dri:[]
    },
    /**
     * シナリオの数（各シナリオに10の食事パターンが存在）
     */
    sceneCount: 10,
    /**
     * 現在のシナリオid（各シナリオに10の食事パターンが存在）
     */
    scene: 0,
    /**
     * 各シナリオに対応したデータ(menu/target)
     */
    dietCases:[],
    /**
     * 各シナリオに対応したデータ(answerList)
     */
    feasibilityCases:[],
    /**
     * 最後に保存した日時
     */
    saveDate: '',
  },
  /**
   * ログイン状態のフラグ
   */
  isLoggedIn: false,
})
export const getters = {}
export const mutations = {
  /**
   * user.Uidを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateUserUid: function (state, payload) {
    state.myApp.user.uid = payload
  },
  /**
   * user.nameを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateUserName: function (state, payload) {
    state.myApp.user.name = payload
  },
  /**
   * fctを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateFct: function (state, payload) {
    state.myApp.dataSet.fct = JSON.parse(JSON.stringify(payload))
  },
  /**
   * driを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateDri: function (state, payload) {
    state.myApp.dataSet.dri = JSON.parse(JSON.stringify(payload))
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
   * ****************************
   * @description ここからauth関連機能
   * ****************************
   */
  /**
   * ログアウト機能
   * @param commit
   * @returns {Promise<void>}
   */
  async logOut({commit}){
    const auth = getAuth();
    signOut(auth).then(() => {
      commit('updateUserUid', '')
      commit('updateUserName', '')
      commit('updateIsLoggedIn', false)
    }).catch((error) => {
      // An error happened.
      const errorCode = error.code
      const errorMessage = error.message
      console.log('guest login error: ', errorCode, errorMessage)
    })
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
        //const credential = GoogleAuthProvider.credentialFromResult(result)
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
  },
  /**
   * ********************************************************
   * @description ここからfirestore関連機能
   * ********************************************************
   */
  /**
   * fctの初期データをdataset/fct01から読み込んでstoreに反映
   *     データが存在しない場合はエラー
   * @param commit
   * @returns {Promise<void>}
   */
  async initFct({commit}){
    const fct = await fireGetDoc('dataset', 'fct01')
    if (fct){
      commit('updateFct', fct)
    } else {
      throw new Error('initFct fail: no data')
    }
  },
  /**
   * driの初期データをdataset/dri01から読み込んでstoreに反映
   *     データが存在しない場合はエラー
   * @param commit
   * @returns {Promise<void>}
   */
  async initDri({commit}){
    const dri = await fireGetDoc('dataset', 'dri01')
    if (dri){
      commit('updateDri', dri)
    } else {
      throw new Error('initDri fail: no data')
    }
  },
  /**
   * firebaseからデータを得てfctに代入
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async fireGetFct({commit, state}) {
    const path = state.myApp.user + '/dataset/'
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
    const path = state.myApp.user.name + '/dataset/'
    const dat = await get(child(dbRef, path + 'myDri04')).catch((err) => {
      console.log(err)
    });
    if (!dat.exists()) {
      console.log('no data found')
    }
    commit('updateDri', dat)
  },


}
