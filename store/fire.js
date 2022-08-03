//import firebase from '~/plugins/firebase'
//import {doc} from "firebase/firestore";
//import {firestoreDb} from "~/plugins/firebasePlugin";
import {
  getAuth, signInAnonymously, setPersistence, signInWithPopup,
  GoogleAuthProvider, browserLocalPersistence, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from "firebase/auth";
import {fireGetDoc, firestoreDb} from "~/plugins/firebasePlugin";
import {doc, setDoc} from "firebase/firestore";

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
      displayName: '',
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
      fctId: 'fct_eth',
      /**
       * driのid
       */
      driId: 'dri01',
      /**
       * CountryNamesのid(firestore)
       */
      CountryNamesId: 'countryNames',
      /**
       * regionのid(firestore)
       */
      regionId: 'eth_region',
      /**
       * portionUnitのid
       */
      portionUnitId: 'portionUnit1',
      /**
       * questionのid
       */
      questionsId: 'questions01',
      /**
       * fctのデータ
       */
      fct: [],
      /**
       * driのデータ
       */
      dri: [],
      /**
       * portionUnitのデータ
       */
      portionUnit: [],
      /**
       * feasibility Questionのデータ
       */
      questions: [],
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
     * 各シナリオに対応したデータ(prodTarget)
     */
    prodTargetCases: [],
    /**
     * 各シナリオに対応したデータ(family -> Eth向け)
     */
    familyCases: [],
    /**
     * 各シナリオに対応したデータ(community -> Eth向け)
     */
    communityCases: [],
    /**
     * 現在対象になっている家族名
     */
    currentFamily: '',
    /**
     * 最後に保存した日時
     */
    saveDate: {
      jsDate: 0,
      date: ''
    },
    /**
     * 食材の解説用データベース名
     */
    foodDictionaryId: 'foodDictionary_eth',
  },
  /**
   * ログイン状態のフラグ
   */
  isLoggedIn: false,
  /**
   * ページ変更の有無(beforeunloadをエラーなしで通すために必要)
   * https://www.uriports.com/blog/easy-fix-for-blocked-attempt-beforeunload-confirmation-panel/
   */
  hasDocumentChanged: false,
  /**
   * ページ内容（myApp）がfirebaseから読み込まれたかどうか判定
   */
  hasMyAppLoaded: false,

})

export const getters = {
  nutritionDemandGetter(state) {
    return state.myApp.menuCases.map((dat) => {
      return dat.target.reduce((accumulator, item, index) => {
        const dri = state.myApp.dataSet.dri[index]
        const count = item.count
        accumulator.En = (accumulator.En || 0) + Number(count) * Number(dri.En)
        accumulator.Pr = (accumulator.Pr || 0) + Number(count) * Number(dri.Pr)
        accumulator.Va = (accumulator.Va || 0) + Number(count) * Number(dri.Va)
        accumulator.Fe = (accumulator.Fe || 0) + Number(count) * Number(dri.Fe)
        accumulator.Wt = (accumulator.Wt || 0) + Number(count) * Number(dri.Wt)
        return accumulator
      }, {})
    })
  },
  nutritionSupplyGetter(state) {
    return state.myApp.menuCases.map((datArray) => {
      return datArray.menu.reduce((accumulator, item) => {
        accumulator.En = (accumulator.En || 0) + Number(item.En)
        accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr)
        accumulator.Va = (accumulator.Va || 0) + Number(item.Va)
        accumulator.Fe = (accumulator.Fe || 0) + Number(item.Fe)
        accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt)
        return accumulator
      }, {})
    })
  },

}

export const mutations = {
  /**
   * 保存した日付を記録
   * @param state
   */
  updateSaveDate: function (state) {
    let time = Date.now()
    state.myApp.saveDate.jsDate = time
    state.myApp.saveDate.date = Date(time)
  },
  /**
   * fctIdを更新
   * @param state
   * @param payload
   */
  updateFctId: function (state, payload) {
    state.myApp.dataSet.fctId = payload
  },
  /**
   * driIdを更新
   * @param state
   * @param payload
   */
  updateDriId: function (state, payload) {
    state.myApp.dataSet.driId = payload
  },
  /**
   * regionIdを更新
   * @param state
   * @param payload
   */
  updateRegionId: function (state, payload) {
    state.myApp.dataSet.regionId = payload
  },
  /**
   * portionUnitIdを更新
   * @param state
   * @param payload
   */
  updatePortionUnitId: function (state, payload) {
    state.myApp.dataSet.portionUnitId = payload
  },
  /**
   * questionsIdを更新
   * @param state
   * @param payload
   */
  updateQuestionsId: function (state, payload) {
    console.log(payload)
    state.myApp.dataSet.questionsId = payload
  },
  /**
   * ユーザーデータ（myApp）が読み込まれたらTrueにセット
   * @param state
   */
  myAppLoadedComplete(state) {
    state.hasMyAppLoaded = true
  },
  /**
   * ページ変更の状態をセット
   * @param state
   * @param payload
   */
  setHasDocumentChanged: function (state, payload) {
    state.hasDocumentChanged = payload
  },
  /**
   * myAppをクリア(ユーザー交代時など)
   * @param state
   */
  clearMyApp(state) {
    state.myApp.user.displayName = ''
    state.myApp.user.uid = ''
    state.myApp.dataSet.fct = []
    state.myApp.dataSet.dri = []
    state.myApp.dataSet.portionUnit = []
    state.myApp.dataSet.questions = []
    state.myApp.menuCases = []
    state.myApp.prodTargetCases = []
    state.myApp.feasibilityCases = []
    state.myApp.saveDate = {}
    state.hasMyAppLoaded = false
  },
  /**
   * myAppを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateMyApp: function (state, payload) {
    state.myApp = JSON.parse(JSON.stringify(payload))
  },
  /**
   * familyCasesを更新
   * @param state
   * @param payload
   */
  updateMyFamily: function (state, payload) {
    //const index = state.myApp.familyCases.findIndex((item)=> item.name === payload.name)
    //state.myApp.familyCases.splice(index, state.myApp.familyCases.length, JSON.parse(JSON.stringify(payload)))
    state.myApp.familyCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * communityCasesを更新
   * @param state
   * @param payload
   */
  updateMyCommunity: function (state, payload) {
    state.myApp.communityCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * ユーザー情報をpayloadで与えられた内容で更新する
   * @param state
   * @param payload
   */
  updateUser: function (state, payload) {
    if (!payload.uid || !payload.displayName) {
      throw new Error('user data is invalid in fire.js - updateUser')
    }
    state.myApp.user.uid = payload.uid
    state.myApp.user.displayName = payload.displayName
    state.myApp.user.email = payload.email
    state.myApp.user.phoneNumber = payload.phoneNumber || ''
    state.myApp.user.country = payload.country || ''
    state.myApp.user.subnational1 = payload.subnational1 || ''
    state.myApp.user.subnational2 = payload.subnational2 || ''
    state.myApp.user.subnational3 = payload.subnational3 || ''
    state.myApp.user.organization = payload.organization || ''
    state.myApp.user.title = payload.title || ''
  },
  /**
   * ユーザー情報をfireAuthから得たログイン情報に基づいて初期化する
   * @param state
   * @param payload
   */
  initUser: function (state, payload) {
    state.myApp.user.uid = payload.uid
    state.myApp.user.displayName = payload.displayName
    state.myApp.user.email = payload.email
    state.myApp.user.phoneNumber = payload.phoneNumber
    state.myApp.user.country = ''
    state.myApp.user.subnational1 = ''
    state.myApp.user.subnational2 = ''
    state.myApp.user.subnational3 = ''
    state.myApp.user.organization = ''
    state.myApp.user.title = ''
  },
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
    state.myApp.user.displayName = payload
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
   * portionUnitを更新
   * @param state
   * @param payload 更新する値（Array of Objects）
   */
  updatePortionUnit: function (state, payload) {
    state.myApp.dataSet.portionUnit = JSON.parse(JSON.stringify(payload))
  },
  /**
   * questionsを更新
   * @param state
   * @param payload 更新する値（Array of Objects）
   */
  updateQuestions: function (state, payload) {
    state.myApp.dataSet.questions = JSON.parse(JSON.stringify(payload))
  },
  /**
   * menuCasesを更新
   * @param state
   * @param payload
   */
  updateMenuCases: function (state, payload) {
    state.myApp.menuCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * prodTargetCasesを更新
   * @param state
   * @param payload
   */
  updateProdTargetCases: function (state, payload) {
    state.myApp.prodTargetCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * feasibilityCasesを更新
   * @param state
   * @param payload
   */
  updateFeasibilityCases: function (state, payload) {
    state.myApp.feasibilityCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * FamilyCasesを更新
   * @param state
   * @param payload
   */
  updateFamilyCases: function (state, payload) {
    state.myApp.familyCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * communityCasesを更新
   * @param state
   * @param payload
   */
  updateCommunityCases: function (state, payload) {
    state.myApp.CommunityCases = JSON.parse(JSON.stringify(payload))
  },
  /**
   * 現在対象になっている家族名の更新
   * @param state
   * @param payload
   */
  updateCurrentFamilyName: function (state, payload) {
    console.log('updateCurrentFamilyName')
    state.myApp.currentFamily = payload
  },
  /**
   * feasibilityCaseのメモを更新
   * @param state
   * @param payload
   */
  updateFeasibilityMemo: function (state, payload) {
    state.myApp.feasibilityCases[payload.pageId].pageMemo = payload.pageMemo
  },
  /**
   * communityCaseのメモを更新
   * @param state
   * @param payload
   */
  updateCommunityMemo: function (state, payload) {
    state.myApp.communityCases[payload.pageId].pageMemo = payload.pageMemo
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
   * FamilyCasesを更新
   * @param dispatch
   * @param payload
   */
  updateFamilyCases({commit}, payload) {
    commit('updateFamilyCases', payload)
  },
  updateFamilyCase({dispatch, state}, payload) {
    let familyCaseTemp = JSON.parse(JSON.stringify(state.myApp.familyCases))
    familyCaseTemp = familyCaseTemp.map((item) => {
      if (item.name === payload.name) {
        item.member = payload.member
      }
      return item
    })
    dispatch('updateFamilyCases', familyCaseTemp)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * communityCasesを更新
   * @param dispatch
   * @param payload
   */
  updateCommunityCases({commit}, payload) {
    commit('updateCommunityCases', payload)
  },
  updateCommunityCase({dispatch, state}, payload) {
    let communityCasesTemp = JSON.parse(JSON.stringify(state.myApp.communityCases))
    communityCasesTemp = communityCasesTemp.map((item) => {
      if (item.name === payload.name) {
        item.member = payload.member
      }
      return item
    })
    dispatch('updateCommunityCases', communityCasesTemp)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * 現在対象になっている家族の更新
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateCurrentFamilyName({commit, dispatch}, payload) {
    commit('updateCurrentFamilyName', payload)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * 新しい家族構成の追加、併せて初期化
   * @param state
   * @param dispatch
   * @param payload
   */
  async addNewFamily({state, dispatch}, payload) {
    console.log('addNewFamily')
    let currentFamily = JSON.parse(JSON.stringify(state.myApp.familyCases))

    //食事リストの初期値設定
    let arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const note = ''
      const menu = []
      arr.push({menu: menu, note: note})
    }

    //feasibilityリストの初期値設定
    let arr2 = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const selectedCrop = []
      const note = ''
      const ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
      const prodTarget = {'share': 100, 'Wt': 0, 'Wt365': 0}
      arr2.push({selectedCrop: selectedCrop, note: note, ansList: ansList, prodTarget: prodTarget})
    }
    currentFamily.push({
      'name': payload.name,
      'member': payload.member,
      'keyNutrient': '',
      'menuCases': arr,
      'feasibilityCases': arr2
    })
    console.log(currentFamily)
    await dispatch('updateCurrentFamilyName', currentFamily[0].name)
    await dispatch('updateFamilyCases', currentFamily)
    await dispatch('setHasDocumentChanged', true)
    //await dispatch('fireSaveAppdata')
  },
  removeFamily({state, dispatch}, payload) {
    let currentFamily = JSON.parse(JSON.stringify(state.myApp.familyCases))
    currentFamily = currentFamily.filter((item) => item.name !== payload)
    dispatch('updateFamilyCases', currentFamily)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * ユーザー登録時に基本データセット（FCT,DRI）をユーザースペースmyAppに
   *     コピーする
   */
  async copyOriginalDataSet2UserDataOnRegistration({state, commit}, payload) {
    //fctのオリジナルデータをコピーしてmyApp/dataSetに保存
    const fct = await fireGetDoc('dataset', payload.dataSet.fctId)
    const newFctId = 'fct_' + payload.user.displayName
    const ref = doc(firestoreDb, 'dataset', newFctId)
    setDoc(ref, fct).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    //driのオリジナルデータをコピーしてmyApp/dataSetに保存
    const dri = await fireGetDoc('dataset', payload.dataSet.driId)
    const newDriId = 'dri_' + payload.user.displayName
    const ref2 = doc(firestoreDb, 'dataset', newDriId)
    setDoc(ref2, dri).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    //portionのオリジナルデータをコピーしてmyApp/dataSetに保存
    const portion = await fireGetDoc('dataset', payload.dataSet.portionUnitId)
    const newPortionId = 'portion_' + payload.user.displayName
    const ref3 = doc(firestoreDb, 'dataset', newPortionId)
    setDoc(ref3, portion).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    //questionのオリジナルデータをコピーしてmyApp/dataSetに保存
    const questions = await fireGetDoc('dataset', payload.dataSet.questionsId)
    const newQuestionsId = 'question_' + payload.user.displayName
    const ref4 = doc(firestoreDb, 'dataset', newQuestionsId)
    setDoc(ref4, questions).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    //storeの中のfctデータベース名を変更
    commit('updateFctId', newFctId)
    //storeの中のdriデータベース名を変更
    commit('updateDriId', newDriId)
    //storeの中のportionUnitデータベース名を変更
    commit('updatePortionUnitId', newPortionId)
    //storeの中のdriデータベース名を変更
    commit('updateQuestionsId', newQuestionsId)
  },
  /**
   * ユーザー情報をpayloadで与えられた内容で更新する
   * @param commit
   * @param payload
   */
  updateUser: function ({commit}, payload) {
    commit('updateUser', payload)
  },
  /**
   * 保存した日付を記録
   * @param state
   */
  updateSaveDate({commit}) {
    commit('updateSaveDate')
  },
  /**
   * FctIdを更新
   * @param commit
   * @param payload
   */
  updateFctId({commit}, payload) {
    commit('updateFctId', payload)
  },
  /**
   * fctを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateFct({commit}, payload) {
    commit('updateFct', payload)
  },
  /**
   * DriIdを更新
   * @param commit
   * @param payload
   */
  updateDriId({commit}, payload) {
    commit('updateDriId', payload)
  },
  /**
   * PortionUnitIdを更新
   * @param commit
   * @param payload
   */
  updatePortionUnitId({commit}, payload) {
    commit('updatePortionUnitId', payload)
  },
  /**
   * questionsIdを更新
   * @param commit
   * @param payload
   */
  updateQuestionsId({commit}, payload) {
    commit('updateQuestionsId', payload)
  },
  /**
   * questionsを更新
   * @param commit
   * @param payload
   */
  updateQuestions({commit}, payload) {
    commit('updateQuestions', payload)
  },
  /**
   * ユーザーデータ（myApp）が読み込まれたらTrueにセット
   */
  myAppLoadedComplete({commit}) {
    commit('myAppLoadedComplete')
  },
  /**
   * ページ変更の状態をセット
   * @param state
   * @param payload
   */
  setHasDocumentChanged: function ({commit}, payload) {
    commit('setHasDocumentChanged', payload)
  },
  /**
   * **********************************************************************************************
   * @description ここからauth関連機能
   * **********************************************************************************************
   */
  /**
   * ログアウト機能
   * @param commit
   * @returns {Promise<void>}
   */
  async logOut({commit}) {
    const auth = getAuth();
    signOut(auth).then(() => {
      commit('clearMyApp')
      commit('updateIsLoggedIn', false)
      //リロード
      window.location.reload()
      //this.$router.push('/')
    }).catch((error) => {
      // An error happened.
      const errorCode = error.code
      const errorMessage = error.message
      console.log('guest login error: ', errorCode, errorMessage)
      throw error
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
        commit('updateUserName', 'test user')
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
        const user = result.user
        commit('initUser', user)
        //commit('updateUserUid', user.uid)
        //commit('updateUserName', user.displayName)
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
   * name/passwordでログイン(signInWithEmailAndPasswordを流用)
   * @param commit
   * @param payload ログイン情報
   *     {payload.name, payload.password}
   * @returns {Promise<void>}
   */
  async loginEmail({commit}, payload) {
    const auth = getAuth();
    const email = payload.name + '@ifna.app'
    const res = await signInWithEmailAndPassword(auth, email, payload.password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        commit('updateIsLoggedIn', false)
        console.log('login error: ' + errorCode + ': ' + errorMessage)
        throw error
      });
    const user = res.user
    commit('initUser', user)
    commit('updateIsLoggedIn', true)
    console.log('login success')

    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('keeping state')
        //topページに移動
        this.$router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('keeping state error: ', errorCode, errorMessage)
        throw error
      })
  },
  /**
   * name/passwordでアカウント作成(signInWithEmailAndPasswordを流用)
   *     アカウント作成後に、基本DBをユーザー用に複製(fct, dri)
   * @param commit
   * @param state
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async registerEmail({commit, state, dispatch}, payload) {
    const auth = getAuth();
    const email = payload.name + '@ifna.app'
    const res = await createUserWithEmailAndPassword(auth, email, payload.password)
      .catch((error) => {
        commit('updateIsLoggedIn', false)
        throw error
        // ..
      })
    const user = res.user
    await updateProfile(user, {
      displayName: payload.name,
      email: email
    }).catch((error) => {
      commit('updateIsLoggedIn', false)
      throw error
      // ..
    });

    commit('initUser', user)
    commit('updateIsLoggedIn', true)
    console.log('login success')
    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('keeping state')
        //topページに移動
        this.$router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('keeping state error: ', errorCode, errorMessage)
        throw error
      })
    // fct. dri, portionUnit, questionsのオリジナルをfirebaseからコピーしてユーザースペースmyAppに貼り付ける
    console.log('copy original database to user space')
    dispatch('copyOriginalDataSet2UserDataOnRegistration', state.myApp)
  },
  //アプリを更新して、Storeに新たな変数が追加された場合、旧バージョンを使っている人向けにこれら新変数の追加更新(例外措置)
  async initFirebaseNewVariable({dispatch, state}) {
    let needInitialization = false
    //questionsが読み込まれていない場合に強制的にfirestoreからコピー（過去バージョン使用者への例外措置）
    if ((!state.myApp.dataSet.questionsId) || (state.myApp.dataSet.questionsId.indexOf('question_') < 0)) {
      alert('feasibility questions are not initialized. data will be loaded from original copy')
      //questionのオリジナルデータをコピーしてfireStoreに保存
      const questions = await fireGetDoc('dataset', 'questions01')
      const newQuestionsId = 'question_' + state.myApp.user.displayName
      const ref = await doc(firestoreDb, 'dataset', newQuestionsId)
      await setDoc(ref, questions).catch((err) => {
        throw new Error('Error in fireSaveAppdata:' + err)
      })
      //fireStoreからquestionsのデータを読み込んでstoreに保存
      await dispatch('updateQuestionsId', newQuestionsId)
      await dispatch('initQuestions')
      needInitialization = true
    }

    //portionが読み込まれていない場合に強制的にfirestoreからコピー（過去バージョン使用者への例外措置）
    if ((!state.myApp.dataSet.portionUnitId) || (state.myApp.dataSet.portionUnitId.indexOf('portion_') < 0)) {
      alert('portion Size is not initialized. data will be loaded from original copy')
      //portionのオリジナルデータをコピーしてfireStoreに保存
      const portion = await fireGetDoc('dataset', 'portionUnit1')
      const newPortionId = 'portion_' + state.myApp.user.displayName
      const ref = await doc(firestoreDb, 'dataset', newPortionId)
      await setDoc(ref, portion).catch((err) => {
        throw new Error('Error in fireSaveAppdata:' + err)
      })
      //fireStoreからportionのデータを読み込んでstoreに保存
      await dispatch('updatePortionUnitId', newPortionId)
      await dispatch('initPortionUnit')
      needInitialization = true
    }

    //ETH研修向け暫定措置：fctデータベースを強制的にfct_ethに変更してデータ更新
    //2022年10月30日までの限定機能
    //**********暫定措置、要削除***********
    //**********暫定措置、要削除***********
    //**********暫定措置、要削除***********
    //**********暫定措置、要削除***********
    const current = new Date()
    const limit = new Date(2022, 10, 30)
    if ((state.myApp.dataSet.fctId !== 'fct_eth0729') && (current < limit)) {
      //fctNameをstoreに保存
      await dispatch('updateFctId', 'fct_eth0729')
      //fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('initFct')
      needInitialization = true
    }

    //familyCasesの新規追加
    if (!state.myApp.familyCases) {
      dispatch('updateFamilyCases', [])
      needInitialization = true
    }

    //currentFamilyの新規追加
    if (state.myApp.currentFamily === null) {
      dispatch('updateCurrentFamilyName', '')
      needInitialization = true
    }

    if (needInitialization) {
      await dispatch('fireSaveAppdata')
      await this.$router.push('/')
    }
  },
  /**
   * ページ遷移・リロードの度にログイン状態を確認(middleware:login.js)、
   *     ログインされてる場合 → ユーザー情報がfetchされているか確認（hasMyAppLoaded）
   *     → fetchされていない場合はfireStoreからfetch
   *     → ログインされていない場合 →　Topページに移動
   * @param commit
   * @param dispatch
   * @param state
   * @returns {Promise<unknown>}
   */
  async initFirebaseAuth({commit, dispatch, state}) {
    return new Promise((resolve, reject) => {
      let unsubscribe = getAuth().onAuthStateChanged(async (user) => {
        if (user) {
          commit('updateIsLoggedIn', true)
          //ログイン成功したら、ユーザーデータ(myApp)がすでに読み込まれているかチェック
          if (!state.hasMyAppLoaded) {
            //ユーザーデータ(myApp)が読み込まれていない場合、fireStoreからfetch
            await dispatch('loadMyApp', user.uid).catch(async () => {
              alert('no data registered, load initial dataset')
              await dispatch('initAll', user)
              dispatch('myAppLoadedComplete')
              console.log('initFirebaseAuth: data fetch from fireStore')
            })
          }
          console.log('initFirebaseAuth:success')
          // user オブジェクトを resolve
          resolve(user);
        } else {
          if (state.myApp.length) {
            commit('clearMyApp')
          }
          commit('updateIsLoggedIn', false)
          reject(new Error('initFirebaseAuth:fail'))
        }

        // 登録解除
        unsubscribe()
      })
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
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async initFct({commit, dispatch, state}) {
    const fct = await fireGetDoc('dataset', state.myApp.dataSet.fctId)
    if (fct) {
      //ObjectをArrayに変換
      const fctArray = await dispatch('formatFct', fct)
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
   * @param state
   * @returns {Promise<void>}
   */
  async initDri({commit, dispatch, state}) {
    const dri = await fireGetDoc('dataset', state.myApp.dataSet.driId)
    if (dri) {
      const driArray = await dispatch('formatDri', dri)
      commit('updateDri', driArray)
    } else {
      throw new Error('initDri fail: no data')
    }
  },
  /**
   * PortionUnitのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async initPortionUnit({state, commit, dispatch}) {
    // portionUnitをfireStoreからfetch (portionUnitIdを使う)
    const portionUnit = await fireGetDoc('dataset', state.myApp.dataSet.portionUnitId).catch((err) => {
      throw Error(err)
    })

    // portionUnitをstoreに保存
    if (portionUnit) {
      const portionUnitArray = await dispatch('formatPortionUnit', portionUnit)
      commit('updatePortionUnit', portionUnitArray)
    } else {
      throw new Error('initPortionUnit fail: no data')
    }
  },
  /**
   * questionsのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async initQuestions({state, commit, dispatch}) {
    console.log(state.myApp.dataSet.questionsId)
    // questionsをfireStoreからfetch (questionsIdを使う)
    const questions = await fireGetDoc('dataset', state.myApp.dataSet.questionsId).catch((err) => {
      throw Error(err)
    })

    // questionsをstoreに保存
    if (questions) {
      const questionsArray = await dispatch('formatQuestions', questions)
      commit('updateQuestions', questionsArray)
    } else {
      throw new Error('initQuestions fail: no data')
    }
  },
  /**
   * CountryNamesのデータをfireStoreから取得して返す
   * @param state
   * @returns {Promise<*>}
   */
  async initCountryNames({state}) {
    const countries = await fireGetDoc('dataset', state.myApp.dataSet.CountryNamesId).catch((err) => {
      throw Error(err)
    })
    if (countries) {
      return countries
    } else {
      throw new Error('initCountryNames fail: no data')
    }
  },
  /**
   * RegionのデータをfireStoreから取得して返す
   * @param state
   * @returns {Promise<*>}
   */
  async initRegion({state}) {
    const region = await fireGetDoc('dataset', state.myApp.dataSet.regionId).catch((err) => {
      throw Error(err)
    })
    if (region) {
      return region
    } else {
      throw new Error('initRegion fail: no data')
    }
  },
  /**
   * JSON -→ array of objectに変換
   * @param fct fct(JSON形式)
   * @returns {{}[]}
   */
  formatFct({}, fct) {
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
  formatDri({}, dri) {
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
   * JSON -→ array of objectに変換
   * @param dat (JSON形式)
   * @returns {{}[]}
   */
  formatPortionUnit({}, dat) {
    let res = []
    for (let key of Object.keys(dat)) {
      let resObj = {}
      resObj.id = dat[key].id
      resObj.FCT_id = dat[key].FCT_id
      resObj.count_method = dat[key].count_method
      resObj.unit_weight = dat[key].unit_weight
      res.push(resObj)
    }
    return res
  },
  /**
   * JSON -→ array of objectに変換
   * @param dat (JSON形式)
   * @returns {{}[]}
   */
  formatQuestions({}, dat) {
    let res = []
    for (let key of Object.keys(dat)) {
      let resObj = {}
      resObj.id = dat[key].id
      resObj.categoryText = dat[key].categoryText
      resObj.questionText = dat[key].questionText
      resObj.answerList = JSON.parse(JSON.stringify(dat[key].answerList))
      res.push(resObj)
    }
    return res
  },
  /**
   * menuCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param payload driのセット(array of object)
   * @param state
   * @param commit
   */
  initMenu({state, commit}, payload) {
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const isTargetSingle = true
      const note = ''
      const menu = []
      const target = payload.map(function (dat) {
        return {id: dat.id, count: 0}
      })
      arr.push({target: target, menu: menu, note: note, isTargetSingle: isTargetSingle})
    }
    commit('updateMenuCases', arr)
  },
  /**
   * prodTargetCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param payload driのセット(array of object)
   * @param state
   * @param commit
   */
  initProdTarget({state, commit}, payload) {
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const isTargetSingle = false
      const note = ''
      const prodTarget = []
      const target = payload.map(function (dat) {
        return {id: dat.id, count: 0}
      })
      arr.push({target: target, prodTarget: prodTarget, note: note, isTargetSingle: isTargetSingle})
    }
    commit('updateProdTargetCases', arr)
  },
  /**
   * feasibilityCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param state
   * @param commit
   * @param payload driテーブルんp情報
   */
  initFeasibility({state, commit}, payload) {
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const target = payload.map(function (dat) {
        return {id: dat.id, count: 0}
      })
      const selectedCrop = []
      const note = ''
      const ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
      arr.push({selectedCrop: selectedCrop, note: note, ansList: ansList, target: target})
    }
    commit('updateFeasibilityCases', arr)
  },
  /**
   * まとめて初期化
   * @param dispatch
   * @param state
   * @param payload
   * @param commit
   */
  async initAll({dispatch, state, commit}, payload) {
    if (!payload) {
      throw new Error('Error: initAll → no registered user-info')
    }
    try {
      await commit('initUser', payload)
      await dispatch('initFct')
      await dispatch('initDri')
      await dispatch('initPortionUnit')
      await dispatch('initQuestions')
      await dispatch('initMenu', state.myApp.dataSet.dri)
      await dispatch('initProdTarget', state.myApp.dataSet.dri)
      await dispatch('initFeasibility', state.myApp.dataSet.dri)
      await dispatch('fireSaveAppdata')
      console.log('initAll: all done')
    } catch (err) {
      console.log('Error: initAll')
      throw err
    }
  },
  /**
   * myAppをfirestoreからfetchしてstoreに保存
   * @param state
   * @param commit
   * @param payload
   * @returns {Promise<void>}
   */
  async loadMyApp({state, commit}, payload) {
    const myApp = await fireGetDoc('users', payload)
    if (myApp) {
      commit('updateMyApp', myApp)
      //初期データ読み込み時のみ、hasDocumentChangedをfalseにセット
      commit('setHasDocumentChanged', false)
    } else {
      throw new Error('loadMyApp fail: no data on fireStore')
    }
  },
  /**
   * myAppをStoreに保存したうえで、更新フラグをオン（setHasDocumentChanged）
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateMyApp({commit, dispatch}, payload) {
    commit('updateMyApp', payload)
    //myAppの変更時は、常に setHasDocumentChanged=true をセット
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * familyCasesを更新
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateMyFamily: function ({commit, dispatch}, payload) {
    commit('updateMyFamily', payload)
    //myAppの変更時は、常に setHasDocumentChanged=true をセット
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * feasibilityCaseのメモを更新
   * @param commit
   * @param payload
   */
  updateFeasibilityMemo({dispatch}, payload) {
    dispatch('updateFeasibilityMemo', payload)
  },
  /**
   * 現在のユーザーの全テータをfirestoreに保存
   * <ul>
   *   <li>client側のデータ：store-myApp以下の全ノード
   *   <li>collection：user
   *   <li>doc：ユーザーのuid
   * @param state
   * @param dispatch
   * @returns {Promise<void>}
   */
  async fireSaveAppdata({state, dispatch}) {
    dispatch('updateSaveDate')
    const ref = doc(firestoreDb, 'users', state.myApp.user.uid)
    setDoc(ref, state.myApp).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    //myAppの変更内容をferestoreに保存できたらhasDocumentChangedをfalseにセット
    dispatch('setHasDocumentChanged', false)
    console.log('saveAppdata: success')
  },
  /**
   * ユーザーデータmyAppを破棄して初期化する。開発中にmyAppのデータ構造を変えた場合に利用
   * @param commit
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async fireResetAppdata({commit, dispatch}, payload) {
    const res = window.confirm('this will reset all user-data. Are you sure?')
    if (!res) {
      return
    }
    commit('clearMyApp') //全ての情報を初期化
    await dispatch('initAll', payload).catch((err) => {
      console.log('Error: fireResetAppdata')
      throw err
    })
    commit('initUser', payload) //user情報を戻す
    await dispatch('fireSaveAppdata').catch((err) => {
      throw err
    })
    console.log('fireResetAppdata: complete')
  },
  /**
   * 各ページ間でデータをコピー＆貼り付け
   * @param commit
   * @param dispatch
   * @param state
   * @param payload
   */
  copyAndPasteMyApp({commit, dispatch, state}, payload) {
    //payloadがfromId, toIdを含まない場合は停止
    if (!payload.fromId) {
      return
    }
    if (!payload.toId) {
      return
    }
    //fromId, toIdが所定の範囲内から外れる場合は停止
    if (
      !(
        (payload.fromId >= 100) && (payload.fromId < 100 + state.myApp.sceneCount) ||
        (payload.fromId >= 200) && (payload.fromId < 200 + state.myApp.sceneCount)
      ) && (
        (payload.toId >= 100) && (payload.toId < 100 + state.myApp.sceneCount) ||
        (payload.toId >= 200) && (payload.toId < 200 + state.myApp.sceneCount)
      )
    ) {
      return
    }

    let myAppWatcher = JSON.parse(JSON.stringify(state.myApp))
    // copyPattern = 0:家族構成＋食品構成をコピー ,1: 家族構成のみコピー
    let copyPattern = 1

    //range = 0: dietCalk, 1:feasibilityCheckに所属
    let fromRange = 0
    let toRange = 0
    if ((payload.fromId >= 200) && (payload.fromId < 200 + myAppWatcher.sceneCount)) {
      fromRange = 1
    }
    if ((payload.toId >= 200) && (payload.toId < 200 + myAppWatcher.sceneCount)) {
      toRange = 1
    }
    if ((fromRange === 0) && (toRange === 0)) {
      copyPattern = 0
    }
    //内部変数の初期化
    let fromFamily = ''
    let fromFoodList = ''
    let isTargetSingle = ''
    let note = ''

    //dietCalkの内容をコピー
    if (fromRange === 0) {
      fromFamily = JSON.stringify(myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].target)
      fromFoodList = JSON.stringify(myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].menu)
      isTargetSingle = myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].isTargetSingle
      note = myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].note
    } else {
      //feasibilityCasedの内容をコピー
      fromFamily = JSON.stringify(myAppWatcher.feasibilityCases[payload.fromId - 100 * (fromRange + 1)].target)
      note = myAppWatcher.feasibilityCases[payload.fromId - 100 * (fromRange + 1)].note
      isTargetSingle = false
    }
    if (toRange === 0) {
      //dietCalkにペースト
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].target = JSON.parse(fromFamily)
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].isTargetSingle = isTargetSingle
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].note = note
      if (copyPattern === 0) {
        //品目リストもあればペースト
        myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].menu = JSON.parse(fromFoodList)
      }
    } else {
      //feasibilityCasedにペースト
      myAppWatcher.feasibilityCases[payload.toId - 100 * (toRange + 1)].target = JSON.parse(fromFamily)
      myAppWatcher.feasibilityCases[payload.toId - 100 * (toRange + 1)].note = note
    }
    dispatch('updateMyApp', myAppWatcher)
  }
}
