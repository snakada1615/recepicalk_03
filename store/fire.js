//import firebase from '~/plugins/firebase'
import {
  getAuth, signInAnonymously, setPersistence, signInWithPopup,
  GoogleAuthProvider, browserLocalPersistence, signOut
} from "firebase/auth";
import {fireGetDoc} from "~/plugins/firebasePlugin";
//import {doc} from "firebase/firestore";
//import {firestoreDb} from "~/plugins/firebasePlugin";

/*
function MenuItem(id, Group, Name, En, Pr, Va, Fe, Wt) {
  this.id = id
  this.Group = Group
  this.Name = Name
  this.En = En
  this.Pr = Pr
  this.Va = Va
  this.Fe = Fe
  this.Wt = Wt
}

function Target(id, count) {
  this.id = id
  this.count = count
}
*/


export const state = () => ({
  myApp: {
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
    dataSet: {
      /**
       * fctのid
       */
      fctId: '',
      /**
       * driのid
       */
      driId: '',
      /**
       * fctのデータ
       */
      fct: [],
      /**
       * driのデータ
       */
      dri: []
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
    menuCases: [],
    /**
     * 各シナリオに対応したデータ(answerList)
     */
    feasibilityCases: [],
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
   * menuCasesを更新
   * @param state
   * @param payload
   */
  updateMenuCases: function(state, payload){
    state.myApp.menuCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * feasibilityCasesを更新
   * @param state
   * @param payload
   */
  updateFeasibilityCases: function(state, payload){
    state.myApp.feasibilityCases = JSON.parse(JSON.stringify(payload))
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
  async logOut({commit}) {
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
  async initFirebaseAuth({commit}) {
    return new Promise((resolve) => {
      let unsubscribe = getAuth().onAuthStateChanged((user) => {
        if (user) {
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
   * @param dispatch
   * @returns {Promise<void>}
   */
  async initFct({commit, dispatch}) {
    const fct = await fireGetDoc('dataset', 'fct01')
    if (fct) {
      const fctArray = await dispatch('formatFct', fct)
      console.log(fctArray)
      commit('updateFct', fctArray)
    } else {
      throw new Error('initFct fail: no data')
    }
  },
  /**
   * driの初期データをdataset/dri01から読み込んでstoreに反映
   *     データが存在しない場合はエラー
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async initDri({commit, dispatch}) {
    const dri = await fireGetDoc('dataset', 'dri01')
    if (dri) {
      const driArray = await dispatch('formatDri', dri)
      commit('updateDri', driArray)
    } else {
      throw new Error('initDri fail: no data')
    }
  },
  /**
   * JSON -→ array of objectに変換
   * @param fct fct(JSON形式)
   * @returns {{}[]}
   */
  formatFct({}, fct){
    let res = []
    for (let key of Object.keys(fct)) {
      let resObj = {}
      resObj.Carbohydrate = fct[key].Carbohydrate
      resObj.En = fct[key].Energy
      resObj.Fe = fct[key].FE
      resObj.Fat = fct[key].Fat
      resObj.Name = fct[key].Food_name
      resObj.Pr = fct[key].Protein
      resObj.Va = fct[key].VITA_RAE
      resObj.Group = fct[key].food_group_unicef
      resObj.food_grp_id = fct[key].food_grp_id
      resObj.id = fct[key].FCT_id
      res.push(resObj)
    }
    return res
  },
  /**
   * JSON -→ array of objectに変換
   * @param dri dri(JSON形式)
   * @returns {{}[]}
   */
  formatDri({}, dri){
    let res = []
    for (let key of Object.keys(dri)) {
      let resObj = {}
      resObj.En = dri[key].energy
      resObj.Fe = dri[key].fe
      resObj.Pr = dri[key].protein
      resObj.Va = dri[key].vita
      resObj.Name = dri[key].nut_group
      resObj.id = dri[key].id
      resObj.max_vol = dri[key].max_vol
      res.push(resObj)
    }
    return res
  },
  /**
   * menuCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param state
   * @param commit
   */
  initMenu({state, commit}){
    const arr = new Array(state.myApp.sceneCount)
    commit('updateMenuCases', arr)
  },
  /**
   * feasibilityCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param state
   * @param commit
   */
  initFeasibility({state, commit}){
    const arr = new Array(state.myApp.sceneCount)
    commit('updateFeasibilityCases', arr)
  },
  initAll({dispatch}){
    dispatch('initFct')
    dispatch('initDri')
    dispatch('initMenu')
    dispatch('initFeasibility')
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
