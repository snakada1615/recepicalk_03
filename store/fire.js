// import firebase from '~/plugins/firebase'
// import {doc} from "firebase/firestore";
// import {firestoreDb} from "~/plugins/firebasePlugin";
import {
  getAuth, signInAnonymously, setPersistence, signInWithPopup,
  GoogleAuthProvider, browserLocalPersistence, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { fireGetDocRemoteFirst, fireGetDoc, firestoreDb } from '~/plugins/firebasePlugin'
import { filterUpdateInfo, makeToast } from '~/plugins/helper'

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

/**
 * feasibilityCaseの初期化セットを返す
 * @param myCount
 * @returns {*[]}
 */
function createNewFeasibilityCases (myCount) {
  // #TODO: 月、栄養素、作物でグループを作成する。このために品目リストのArrayサイズを固定長でなく可変長にする
  if (!myCount) {
    return []
  }
  const arr = []
  for (let mon = 1; mon < 13; mon++) {
    for (let i = 0; i < myCount; i++) {
      const selectedCrop = {}
      const month = mon
      const note = ''
      const index = i
      const ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
      const prodTarget = { share: 100, Wt: 0, Wt365: 0 }
      arr.push({ selectedCrop, note, ansList, prodTarget, month, index })
    }
  }
  return arr
}

/**
 * JSON -→ array of objectに変換
 * @param fct fct(JSON形式)
 * @returns {{}[]}
 */
function formatFct (fct) {
  const res = []
  for (const key of Object.keys(fct)) {
    const resObj = {}
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
}

/**
 * JSON -→ array of objectに変換
 * @param dri dri(JSON形式)
 * @returns {{}[]}
 */
function formatDri (dri) {
  const res = []
  for (const key of Object.keys(dri)) {
    const resObj = {}
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
}

/**
 * JSON -→ array of objectに変換
 * @param dat (JSON形式)
 * @returns {{}[]}
 */
function formatPortionUnit (dat) {
  const res = []
  for (const key of Object.keys(dat)) {
    const resObj = {}
    resObj.id = dat[key].id
    resObj.FCT_id = dat[key].FCT_id
    resObj.count_method = dat[key].count_method
    resObj.unit_weight = dat[key].unit_weight
    res.push(resObj)
  }
  return res
}

/**
 * JSON -→ array of objectに変換
 * @param dat (JSON形式)
 * @returns {{}[]}
 */
function formatQuestions (dat) {
  const res = []
  for (const key of Object.keys(dat)) {
    const resObj = {}
    resObj.id = dat[key].id
    resObj.categoryText = dat[key].categoryText
    resObj.questionText = dat[key].questionText
    resObj.answerList = JSON.parse(JSON.stringify(dat[key].answerList))
    res.push(resObj)
  }
  return res
}

/**
 * menuCasesとfeasibilityCasesの初期化した配列を返す
 *
 * @param payload (key=1:feasibilityCases, 2:menuCases, data=dri/fct, count=繰り返し回数)
 * @returns {*[]}
 */
function setInitialArray (payload) {
  const arr = []
  // feasibilityの場合
  if (Number(payload.key) === 1) {
    for (let i = 0; i < payload.count; i++) {
      const target = payload.data.map(function (dat) {
        return { id: dat.id, count: 0 }
      })
      const selectedCrop = []
      const note = ''
      const ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
      arr.push({ selectedCrop, note, ansList, target })
    }
    return arr
  }
  // menuの場合
  if (Number(payload.key) === 2) {
    for (let i = 0; i < payload.count; i++) {
      const isTargetSingle = true
      const note = ''
      const menu = []
      const target = payload.data.map(function (dat) {
        return { id: dat.id, count: 0 }
      })
      arr.push({ target, menu, note, isTargetSingle })
    }
    console.log(arr)
    return arr
  }
}

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
      phoneNumber: '',
      userType: 'normal'
    },
    /**
     * 利用するデータセット：fctとdri
     */
    dataSet: {
      /**
       * fctのid
       */
      fctId: 'fct_eth0729',
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
      portionUnitId: 'portion_0927',
      /**
       * questionのid
       */
      questionsId: 'question_nakada02',
      /**
       * forcedUpdateInfoのId
       */
      forcedUpdateInfoId: 'forcedUpdateInfoId01',
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
      /**
       * cropCalendarのID
       */
      cropCalendarId: 'cropCalendar_221010',
      /**
       * cropCalendarのデータ
       */
      cropCalendar: [],
      /*
             * 以下の構造
             searchReg: {
              country:'',
              subnational1: '',
              subnational2: '',
              subnational3: '',
            },
             setData:{
              fctId: '',
              driId: '',
              portionUnitId: '',
              questionsId: '',
              cropCalendarId: '',
            }
      */
      /**
       * 上記の構造をとなる
       */
      forcedUpdateInfo: [
        // Eth限定のデータセット
        {
          date: '',
          searchReg: {
            country: 'Ethiopia',
            subnational1: '',
            subnational2: '',
            subnational3: ''
          },
          setData: {
            fctId: 'fct_eth0729',
            driId: '',
            portionUnitId: 'portion_0927',
            questionsId: 'question_nakada02',
            cropCalendarId: ''
          }
        }
      ]
    },
    /**
     * データベースの更新の有無
     */
    isUpdateAvailable: false,
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
     * 現在対象になっているコミュニティ名
     */
    currentCommunity: '',
    /**
     * 最後に保存した日時
     */
    saveDate: {
      jsDate: 0,
      date: ''
    },
    dateOfLatestUpdate: 1666909589274,
    /**
     * 食材の解説用データベース名
     */
    foodDictionaryId: 'foodDictionary_eth'
  },
  /**
   * admin登録に必要なパスワード
   */
  adminPass: 'nfa2022',
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
  hasMyAppLoaded: false

})

export const getters = {
  nutritionDemandGetter (state) {
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
  nutritionSupplyGetter (state) {
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
  }

}

export const mutations = {
  updateIsUpdateAvailable: function (state, payload) {
    state.myApp.isUpdateAvailable = payload
  },
  /**
   * dateOfLatestUpdateの値更新
   * @param state
   * @param payload
   */
  updateDateOfLatestUpdate: function (state, payload) {
    state.myApp.dateOfLatestUpdate = payload
  },
  /**
   * 保存した日付を記録
   * @param state
   */
  updateSaveDate: function (state) {
    const time = new Date()
    state.myApp.saveDate.jsDate = time.toLocaleString('ja') + '_ja'
    state.myApp.saveDate.date = time.toString()
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
    state.myApp.dataSet.questionsId = payload
  },
  /**
   * cropCalendarIdを更新
   * @param state
   * @param payload
   */
  updateCropCalendarId (state, payload) {
    state.myApp.dataSet.cropCalendarId = payload
  },
  /**
   * ユーザーデータ（myApp）が読み込まれたらTrueにセット
   * @param state
   */
  myAppLoadedComplete (state) {
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
  clearMyApp (state) {
    state.myApp.user.displayName = ''
    state.myApp.user.uid = ''
    state.myApp.dataSet.fct = []
    state.myApp.dataSet.dri = []
    state.myApp.dataSet.portionUnit = []
    state.myApp.dataSet.cropCalendar = []
    state.myApp.dataSet.questions = []
    state.myApp.menuCases = []
    state.myApp.prodTargetCases = []
    state.myApp.feasibilityCases = []
    state.myApp.familyCases = []
    state.myApp.communityCases = []
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
    // const index = state.myApp.familyCases.findIndex((item)=> item.name === payload.name)
    // state.myApp.familyCases.splice(index, state.myApp.familyCases.length, JSON.parse(JSON.stringify(payload)))
    state.myApp.familyCases = JSON.parse(JSON.stringify(payload))
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
    state.myApp.user.userType = payload.userType || ''
  },
  /**
   * forcedUpdateInfoの更新
   * @param state
   * @param payload
   */
  updateForcedUpdateInfo (state, payload) {
    state.myApp.dataSet.forcedUpdateInfo = JSON.parse(JSON.stringify(payload))
  },
  /**
   * forcedUpdateInfoIdの更新
   * @param state
   * @param payload
   */
  updateForcedUpdateInfoId: function (state, payload) {
    state.myApp.dataSet.forcedUpdateInfoId = payload
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
    state.myApp.user.userType = 'normal'
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
   * cropCalendarを更新
   * @param state
   * @param payload 更新する値（Array of Objects）
   */
  updateCropCalendar: function (state, payload) {
    if (!Array.isArray(payload)) {
      throw new TypeError('updateCropCalendar Err: payload should be Array')
    }
    state.myApp.dataSet.cropCalendar = JSON.parse(JSON.stringify(payload))
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
    state.myApp.communityCases = JSON.parse(JSON.stringify(payload))
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
   * 現在対象になっているcommunity名の更新
   * @param state
   * @param payload
   */
  updateCurrentCommunityName: function (state, payload) {
    console.log('updateCurrentCommunityName')
    state.myApp.currentCommunity = payload
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
  updateIsLoggedIn ({ commit }, payload) {
    commit('updateIsLoggedIn', payload)
  },
  /**
   * FamilyCasesを更新
   * @param dispatch
   * @param payload
   */
  updateFamilyCases ({ commit }, payload) {
    commit('updateFamilyCases', payload)
  },
  updateFamilyCase ({ dispatch, state }, payload) {
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
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateCommunityCases ({ commit, dispatch }, payload) {
    commit('updateCommunityCases', payload)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * communityCasesの一要素（payload）のみを更新
   * @param dispatch
   * @param state
   * @param payload
   */
  updateCommunityCase ({ dispatch, state }, payload) {
    let communityCasesTemp = JSON.parse(JSON.stringify(state.myApp.communityCases))
    communityCasesTemp = communityCasesTemp.map((item) => {
      if (item.name === payload.name) {
        // ここはJSON.stringify出なくて良いか？
        return payload
      } else {
        return item
      }
    })
    dispatch('updateCommunityCases', communityCasesTemp)
  },
  /**
   * forcedUpdateInfoIdの更新
   * @param commit
   * @param payload
   */
  updateForcedUpdateInfoId ({ commit }, payload) {
    commit('updateForcedUpdateInfoId', payload)
  },
  /**
   * forcedUpdateInfoの更新
   * @param commit
   * @param payload
   */
  updateForcedUpdateInfo ({ commit }, payload) {
    commit('updateForcedUpdateInfo', payload)
  },

  /**
   * 現在対象になっている家族の更新
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateCurrentFamilyName ({ commit, dispatch }, payload) {
    commit('updateCurrentFamilyName', payload)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * 現在対象になっているCommunityの更新
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateCurrentCommunityName ({ commit, dispatch }, payload) {
    commit('updateCurrentCommunityName', payload)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * 新しい家族構成の追加、併せて初期化
   * @param state
   * @param dispatch
   * @param payload
   */
  async addNewFamily ({ state, dispatch }, payload) {
    console.log('addNewFamily')
    const currentFamily = JSON.parse(JSON.stringify(state.myApp.familyCases))

    // 食事リストの初期値設定
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const note = ''
      const menu = []
      arr.push({ menu, note })
    }

    // feasibilityリストの初期値設定
    const arr2 = createNewFeasibilityCases(state.myApp.sceneCount)

    currentFamily.push({
      name: payload.name,
      member: payload.member,
      keyNutrient: '',
      keyCommodity: '',
      currentMonth: 1,
      menuCases: arr,
      feasibilityCases: arr2
    })
    await dispatch('updateCurrentFamilyName', currentFamily[0].name)
    await dispatch('updateFamilyCases', currentFamily)
    await dispatch('setHasDocumentChanged', true)
    // await dispatch('fireSaveAppdata')
  },
  /**
   * 新しいCommunityの追加、併せて初期化
   * @param state
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async addNewCommunity ({ state, dispatch }, payload) {
    const currentCommunity = JSON.parse(JSON.stringify(state.myApp.communityCases))
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const isTargetSingle = false
      const note = ''
      const menu = []
      const target = payload.member.map(function (dat) {
        return { id: dat.id, count: 0 }
      })
      arr.push({ target, menu, note, isTargetSingle })
    }

    // feasibilityリストの初期値設定
    const arr2 = createNewFeasibilityCases(state.myApp.sceneCount)

    currentCommunity.push({
      name: payload.name,
      member: payload.member,
      keyNutrient: '',
      keyCommodity: '',
      currentMonth: 1,
      menuCases: arr,
      feasibilityCases: arr2
    })
    await dispatch('updateCurrentCommunityName', currentCommunity[0].name)
    await dispatch('updateCommunityCases', currentCommunity)
    await dispatch('setHasDocumentChanged', true)
  },
  /**
   *
   * @param state
   * @param dispatch
   * @param payload
   */
  removeFamily ({ state, dispatch }, payload) {
    let currentFamily = JSON.parse(JSON.stringify(state.myApp.familyCases))
    currentFamily = currentFamily.filter(item => item.name !== payload)
    dispatch('updateFamilyCases', currentFamily)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   *
   * @param state
   * @param dispatch
   * @param payload
   */
  removeCommunity ({ state, dispatch }, payload) {
    let currentCommunity = JSON.parse(JSON.stringify(state.myApp.communityCases))
    currentCommunity = currentCommunity.filter(item => item.name !== payload)
    dispatch('updateCommunityCases', currentCommunity)
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * questionsの質問内容を更新した際にfireStoreを更新する
   * @param state
   * @param dispatch
   * @param payload
   * @returns {Promise<boolean>}
   */
  async fireSaveQuestions ({ state, dispatch }, payload) {
    const ref = doc(firestoreDb, 'dataset', state.myApp.dataSet.questionsId)
    // const ref = doc(firestoreDb, 'dataset', 'question_eth')
    await setDoc(ref, payload).catch((err) => {
      throw new Error('Error in fireSaveQuestions:' + err)
    })
    console.log('question saved to fireStore (payload -> fireStore')
    console.log('Now question in store is replaced by the question from fireStore (fireStore -> store)')
    await dispatch('fetchQuestionsFromFire').catch((err) => {
      throw new Error('Error in fireSaveQuestions:' + err)
    })
    console.log('question in store refreshed!')
    return true
  },
  /**
   * Calendarの質問内容を更新した際にfireStoreを更新する
   * @param dispatch
   * @param payload
   * @returns {Promise<boolean>}
   */
  async fireSaveCropCalendar ({ dispatch }, payload) {
    const ref = await doc(firestoreDb, 'dataset', payload.docName)
    await setDoc(ref, payload.data).catch((err) => {
      throw new Error('Error in fireSaveCropCalendar:' + err)
    })
    console.log('cropCalendar saved to fireStore (payload -> fireStore')
    return true
  },
  /**
   * portionUnit更新時にfireStore->dataSetを更新
   * @param dispatch
   * @param payload
   * @returns {Promise<boolean>}
   */
  async fireSavePortionUnit ({ dispatch }, payload) {
    const ref = await doc(firestoreDb, 'dataset', payload.docName)
    await setDoc(ref, payload.data).catch((err) => {
      throw new Error('Error in fireSavePortionUnit:' + err)
    })
    console.log('portionUnit saved to fireStore (payload -> fireStore')
    return true
  },
  /**
   * firebase -> dataSet -> forceUpdateInfoにpayloadを保存
   * @param dispatch
   * @param state
   * @param payload
   * @returns {Promise<boolean>}
   */
  async fireSaveForceUpdateInfo ({ dispatch, state }, payload) {
    const ref = await doc(firestoreDb, 'dataset', state.myApp.dataSet.forcedUpdateInfoId)
    await setDoc(ref, payload).catch((err) => {
      throw new Error('Error in fireSaveForceUpdateInfo:' + err)
    })
    console.log('forcedUpdateInfo saved to fireStore (payload -> fireStore')
    return true
  },
  /**
   * ユーザー登録時に基本データセット（FCT,DRI）をユーザースペースmyAppに
   *     コピーする
   */
  async copyOriginalDataSet2UserDataOnRegistration ({ state, commit }, payload) {
    // fctのオリジナルデータをコピーしてmyApp/dataSetに保存
    const fct = await fireGetDoc('dataset', payload.dataSet.fctId)
    const newFctId = 'fct_' + payload.user.displayName
    const ref = doc(firestoreDb, 'dataset', newFctId)
    setDoc(ref, fct).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    // driのオリジナルデータをコピーしてmyApp/dataSetに保存
    const dri = await fireGetDoc('dataset', payload.dataSet.driId)
    const newDriId = 'dri_' + payload.user.displayName
    const ref2 = doc(firestoreDb, 'dataset', newDriId)
    setDoc(ref2, dri).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    // portionのオリジナルデータをコピーしてmyApp/dataSetに保存
    const portion = await fireGetDoc('dataset', payload.dataSet.portionUnitId)
    const newPortionId = 'portion_' + payload.user.displayName
    const ref3 = doc(firestoreDb, 'dataset', newPortionId)
    setDoc(ref3, portion).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    // questionのオリジナルデータをコピーしてmyApp/dataSetに保存
    const questions = await fireGetDoc('dataset', payload.dataSet.questionsId)
    const newQuestionsId = 'question_' + payload.user.displayName
    const ref4 = doc(firestoreDb, 'dataset', newQuestionsId)
    setDoc(ref4, questions).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    // storeの中のfctデータベース名を変更
    commit('updateFctId', newFctId)
    // storeの中のdriデータベース名を変更
    commit('updateDriId', newDriId)
    // storeの中のportionUnitデータベース名を変更
    commit('updatePortionUnitId', newPortionId)
    // storeの中のdriデータベース名を変更
    commit('updateQuestionsId', newQuestionsId)
  },
  /**
   * ユーザー情報をpayloadで与えられた内容で更新する
   * @param commit
   * @param payload
   */
  updateUser: function ({ commit }, payload) {
    commit('updateUser', payload)
  },
  /**
   * 保存した日付を記録
   * @param state
   */
  updateSaveDate ({ commit }) {
    commit('updateSaveDate')
  },
  /**
   * FctIdを更新
   * @param commit
   * @param payload
   */
  updateFctId ({ commit }, payload) {
    commit('updateFctId', payload)
  },
  /**
   * fctを更新
   * @param state
   * @param payload 更新する値（JSON）
   */
  updateFct ({ commit }, payload) {
    commit('updateFct', payload)
  },
  /**
   * DriIdを更新
   * @param commit
   * @param payload
   */
  updateDriId ({ commit }, payload) {
    commit('updateDriId', payload)
  },
  /**
   * PortionUnitIdを更新
   * @param commit
   * @param payload
   */
  updatePortionUnitId ({ commit }, payload) {
    commit('updatePortionUnitId', payload)
  },
  /**
   * portionUnitを更新
   * @param commit
   * @param payload 更新する値（Array of Objects）
   */
  updatePortionUnit ({ commit }, payload) {
    commit('updatePortionUnit', payload)
  },
  /**
   * questionsIdを更新
   * @param commit
   * @param payload
   */
  updateQuestionsId ({ commit }, payload) {
    commit('updateQuestionsId', payload)
  },
  /**
   * questionsを更新
   * @param commit
   * @param payload
   */
  updateQuestions ({ commit }, payload) {
    commit('updateQuestions', payload)
  },
  /**
   * cropCalendarIdを更新
   * @param commit
   * @param payload
   */
  updateCropCalendarId ({ commit }, payload) {
    commit('updateCropCalendarId', payload)
  },
  /**
   * cropCalendarを更新
   * @param commit
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  updateCropCalendar ({ commit, dispatch }, payload) {
    commit('updateCropCalendar', payload)
  },
  /**
   * ユーザーデータ（myApp）が読み込まれたらTrueにセット
   */
  myAppLoadedComplete ({ commit }) {
    commit('myAppLoadedComplete')
  },
  /**
   * ページ変更の状態をセット
   * @param state
   * @param payload
   */
  setHasDocumentChanged: function ({ commit }, payload) {
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
  logOut ({ commit }) {
    const auth = getAuth()
    signOut(auth).then(() => {
      commit('clearMyApp')
      commit('updateIsLoggedIn', false)
      // リロード
      window.location.reload()
      // this.$router.push('/')
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
  async loginGuest ({ commit }) {
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
        const errorCode = error.code
        const errorMessage = error.message
        console.log('guest keeping state error: ', errorCode, errorMessage)
      })
  },
  /**
   * googleアカウントでのログイン
   * @param commit
   * @returns {Promise<void>}
   */
  async loginGoogle ({ commit }) {
    console.log('login action')
    const provider = new GoogleAuthProvider()
    const auth = await getAuth()

    await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        commit('initUser', user)
        // commit('updateUserUid', user.uid)
        // commit('updateUserName', user.displayName)
        commit('updateIsLoggedIn', true)

        console.log('login success')
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        commit('updateIsLoggedIn', false)
        // const credential = GoogleAuthProvider.credentialFromError(error)

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
        const errorCode = error.code
        const errorMessage = error.message
        console.log('keeping state error: ', errorCode, errorMessage)
      })
  },
  /**
   * name/passwordでログイン(signInWithEmailAndPasswordを流用)
   * @param commit
   * @param payload ログイン情報
   *     {payload.name, payload.password}
   * @param state
   * @returns {Promise<void>}
   */
  async loginEmail ({ commit, state }, payload) {
    const auth = getAuth()
    const email = payload.name + '@ifna.app'
    const res = await signInWithEmailAndPassword(auth, email, payload.password)
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        commit('updateIsLoggedIn', false)
        console.log('login error: ' + errorCode + ': ' + errorMessage)
        throw error
      })
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

        // topページに移動
        this.$router.push('/')

        // // ユーザーの国がEthiopiaの場合とそうでない場合で飛び先を変更
        // console.log(state.myApp.user)
        // console.log(state.myApp.user.country)
        // if (state.myApp.user.country === 'Ethiopia') {
        //   this.$router.push('/startPageEth')
        // } else {
        //   this.$router.push('/')
        // }
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('keeping state error: ', errorCode, errorMessage)
        throw error
      })
  },
  test () {
    return 'test OK'
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
  async registerEmail ({ commit, state, dispatch }, payload) {
    const auth = getAuth()
    const email = payload.name + '@ifna.app'
    const res = await createUserWithEmailAndPassword(auth, email, payload.password)
      .catch((error) => {
        commit('updateIsLoggedIn', false)
        throw error
        // ..
      })
    await updateProfile(res.user, {
      displayName: payload.name,
      email
    }).catch((error) => {
      commit('updateIsLoggedIn', false)
      throw error
      // ..
    })

    commit('initUser', res.user)
    commit('updateIsLoggedIn', true)
    console.log('login success')
    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('keeping state')
        // topページに移動
        this.$router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('keeping state error: ', errorCode, errorMessage)
        throw error
      })
  },
  // アプリを更新して、Storeに新たな変数が追加された場合、旧バージョンを使っている人向けにこれら新変数の追加更新(例外措置)
  async initFirebaseNewVariable ({ dispatch, state }) {
    let needInitialization = false
    // questionsが読み込まれていない場合に強制的にfirestoreからコピー（過去バージョン使用者への例外措置）
    if ((!state.myApp.dataSet.questionsId) || (!state.myApp.dataSet.questionsId.includes('question'))) {
      alert('feasibility questions are not initialized. data will be loaded from original copy')
      // questionのオリジナルデータをコピーしてfireStoreに保存
      const questions = await fireGetDoc('dataset', 'question_nakada02')
      const newQuestionsId = 'question_' + state.myApp.user.displayName
      const ref = await doc(firestoreDb, 'dataset', newQuestionsId)
      await setDoc(ref, questions).catch((err) => {
        throw new Error('Error in fireSaveAppdata:' + err)
      })
      // fireStoreからquestionsのデータを読み込んでstoreに保存
      await dispatch('updateQuestionsId', newQuestionsId)
      await dispatch('fetchQuestionsFromFire')
      needInitialization = true
    }

    // portionが読み込まれていない場合に強制的にfirestoreからコピー（過去バージョン使用者への例外措置）
    if ((!state.myApp.dataSet.portionUnitId) || (!state.myApp.dataSet.portionUnitId.includes('portion_'))) {
      alert('portion Size is not initialized. data will be loaded from original copy')
      // portionのオリジナルデータをコピーしてfireStoreに保存
      const portion = await fireGetDoc('dataset', 'portionUnit1')
      const newPortionId = 'portion_' + state.myApp.user.displayName
      const ref = await doc(firestoreDb, 'dataset', newPortionId)
      await setDoc(ref, portion).catch((err) => {
        throw new Error('Error in fireSaveAppdata:' + err)
      })
      // fireStoreからportionのデータを読み込んでstoreに保存
      await dispatch('updatePortionUnitId', newPortionId)
      await dispatch('fetchPortionUnitFromFire')
      needInitialization = true
    }

    // cropCalendarが読み込まれていない場合に強制的にfirestoreからコピー（過去バージョン使用者への例外措置）
    if ((!state.myApp.dataSet.cropCalendarId) || (!state.myApp.dataSet.cropCalendarId.includes('cropCalendar'))) {
      alert('cropCalendar is not initialized. data will be loaded from original copy')
      // cropCalendarのオリジナルデータをコピーしてfireStoreに保存
      const newCropCalendarId = 'cropCalendar_221010'
      // fireStoreからcropCalendarのデータを読み込んでstoreに保存
      await dispatch('fetchCropCalendarFromFire', newCropCalendarId)
      needInitialization = true
    }

    // familyCasesの新規追加
    if (state.myApp.familyCases === undefined) {
      console.log('found error and add familyCases')
      dispatch('updateFamilyCases', [])
      needInitialization = true
    }

    // familyCasesの新規追加
    if (state.myApp.communityCases === undefined) {
      console.log('found some error and initialize communityCases')
      console.log(state.myApp.communityCases)
      dispatch('updateCommunityCases', [])
      console.log(state.myApp.communityCases)
      needInitialization = true
    }

    // currentFamilyの新規追加
    // X == null は (X === null || X === undefined)と等値
    if (state.myApp.currentFamily == null) {
      console.log('found some error and initialize currentFamilyName')
      dispatch('updateCurrentFamilyName', '')
      needInitialization = true
    }

    // currentFamilyの新規追加
    // X == null は (X === null || X === undefined)と等値
    if (state.myApp.currentCommunity == null) {
      console.log('found some error and initialize currentCommunity Name')
      dispatch('updateCurrentCommunityName', '')
      needInitialization = true
    }

    // forcedUpdateInfoIdの新規追加
    // X == null は (X === null || X === undefined)と等値
    if (state.myApp.dataSet.forcedUpdateInfoId == null) {
      console.log('There are no information for forcedUpdateInfo. The app will be updated')
      dispatch('updateForcedUpdateInfoId', 'forcedUpdateInfoId01')
      needInitialization = true
    }

    if (needInitialization) {
      await dispatch('fireSaveAppdata')
      await this.$router.push('/')
    }
  },
  async checkUpdate ({ dispatch, commit, state }, goUpdate = false) {
    // forcedUpdateInfoが登録されていなければ読み込んで再起動
    if (state.myApp.dataSet.forcedUpdateInfoId == null) {
      console.log('There are no information for forcedUpdateInfo. The app will be updated')
      dispatch('updateForcedUpdateInfoId', 'forcedUpdateInfoId01')
      await dispatch('fireSaveAppdata')
      await this.$router.push('/')
    }

    const updateInfo = await fireGetDoc('dataset', state.myApp.dataSet.forcedUpdateInfoId)
    if (!updateInfo) {
      // itemsの値がblank/nullの場合は終了
      commit('updateIsUpdateAvailable', false)
      return false
    }

    // itemsの値がblank/nullの場合は終了
    const items = Object.values(updateInfo)
    if ((Array.isArray(items) && !items.length) || (items == null)) {
      commit('updateIsUpdateAvailable', false)
      return false
    }

    // 現在のuser情報に合致する更新情報を取得
    const filtered = filterUpdateInfo(state.myApp.user, items)
    console.log(filtered)

    // 該当する更新情報がない場合は終了
    if (Object.keys(filtered).length === 0) {
      commit('updateIsUpdateAvailable', false)
      return false
    }

    // 最新の更新情報の有無を登録
    const res = (filtered.date > state.myApp.dateOfLatestUpdate)
    if (!goUpdate) {
      commit('updateIsUpdateAvailable', res)
      return true
    } else {
      dispatch('goUpdate', {
        date: Date.now(),
        updateInfo: filtered,
        originalInfo: state.myApp.dataSet.forcedUpdateInfo
      })
    }
  },
  /**
   * 指定されたupdateInfoに従ってoriginalInfoを更新
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async goUpdate ({ dispatch, state, commit }, payload) {
    // まず更新日をアップデートする: , updateInfo, originalInfo, date
    commit('updateDateOfLatestUpdate', payload.date)

    // 指定されたdocument-Idでデータ更新
    const forcedDatasets = payload.updateInfo.setData
    const originalInfoData = payload.originalInfo.setData

    // if (forcedDatasets.fctId && state.myApp.dataSet.fctId !== forcedDatasets.fctId) {
    if (forcedDatasets.fctId && originalInfoData.fctId !== forcedDatasets.fctId) {
      // fctNameをstoreに保存
      await dispatch('updateFctId', forcedDatasets.fctId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchFctFromFire')
    }
    if (forcedDatasets.driId && originalInfoData.driId !== forcedDatasets.driId) {
      // fctNameをstoreに保存
      await dispatch('updateDriId', forcedDatasets.driId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchDriFromFire')
    }
    if (forcedDatasets.portionUnitId && originalInfoData.portionUnitId !== forcedDatasets.portionUnitId) {
      // fctNameをstoreに保存
      await dispatch('updatePortionUnitId', forcedDatasets.portionUnitId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchPortionUnitFromFire')
    }
    if (forcedDatasets.cropCalendarId && originalInfoData.cropCalendarId !== forcedDatasets.cropCalendarId) {
      // fctNameをstoreに保存
      await dispatch('updatePortionUnitId', forcedDatasets.cropCalendarId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchCropCalendarFromFire')
    }

    await dispatch('fireSaveAppdata').then(() => {
      makeToast(this, 'data have been updated')
      window.location.reload(true)
    })
    // await this.$router.push('/startPageEth')
  },
  /**
   * 特定の国・地域に対して強制的に基本データを指定
   * @param dispatch
   * @param state
   * @returns {Promise<void>}
   */
  async forcedUpdate ({ dispatch, state }) {
    // #TODO: fireStore本体に共通のforcedUpdateを保存して読み込むように変更
    // forcedUpdateInfoが登録されていなければ読み込んで再起動
    if (state.myApp.dataSet.forcedUpdateInfoId == null) {
      console.log('There are no information for forcedUpdateInfo. The app will be updated')
      dispatch('updateForcedUpdateInfoId', 'forcedUpdateInfoId01')
      await dispatch('fireSaveAppdata')
      await this.$router.push('/')
    }

    // サーバーから最新のforcedUpdateを取得してstoreに読み込む
    await dispatch('fetchForcedUpdateInfoFromFire')

    // forcedUpdateInfoの値がblank/nullの場合は終了
    if ((Array.isArray(state.myApp.dataSet.forcedUpdateInfo) && !state.myApp.dataSet.forcedUpdateInfo.length) ||
      (state.myApp.dataSet.forcedUpdateInfo == null)) {
      return
    }

    // 現在のuser情報に合致している検索条件を抽出
    const myUser = state.myApp.user
    const filtered = filterUpdateInfo(myUser, state.myApp.dataSet.forcedUpdateInfo)

    // 指定されたdocument-Idでデータ更新
    let needInitialization = false
    const forcedDatasets = filtered.setData
    if (forcedDatasets.fctId && state.myApp.dataSet.fctId !== forcedDatasets.fctId) {
      // fctNameをstoreに保存
      await dispatch('updateFctId', forcedDatasets.fctId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchFctFromFire')
      needInitialization = true
    }
    if (forcedDatasets.driId && state.myApp.dataSet.driId !== forcedDatasets.driId) {
      // fctNameをstoreに保存
      await dispatch('updateDriId', forcedDatasets.driId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchDriFromFire')
      needInitialization = true
    }
    if (forcedDatasets.portionUnitId && state.myApp.dataSet.portionUnitId !== forcedDatasets.portionUnitId) {
      // fctNameをstoreに保存
      await dispatch('updatePortionUnitId', forcedDatasets.portionUnitId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchPortionUnitFromFire')
      needInitialization = true
    }
    if (forcedDatasets.cropCalendarId && state.myApp.dataSet.cropCalendarId !== forcedDatasets.cropCalendarId) {
      // fctNameをstoreに保存
      await dispatch('updatePortionUnitId', forcedDatasets.cropCalendarId)
      // fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
      await dispatch('fetchCropCalendarFromFire')
      needInitialization = true
    }

    if (needInitialization) {
      await dispatch('fireSaveAppdata')
      await this.$router.push('/startPageEth')
    }
  },
  /**
   * ページ遷移・リロードの度にログイン状態を確認(middleware:login.js)、
   *     ログインされてる場合 → ユーザー情報がfetchされているか確認（hasMyAppLoaded）
   *     → fetchされていない場合はfireStoreからfetch
   *     → ログインされていない場合 → Topページに移動
   * @param commit
   * @param dispatch
   * @param state
   * @returns {Promise<unknown>}
   */
  initFirebaseAuth ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
        console.log('initFirebaseAuth:' + state.hasMyAppLoaded)
        if (user) {
          console.log('initFirebaseAuth:' + 2)
          commit('updateIsLoggedIn', true)
          console.log('initFirebaseAuth:' + 3)
          // ログイン成功したら、ユーザーデータ(myApp)がすでに読み込まれているかチェック
          if (!state.hasMyAppLoaded) {
            console.log('initFirebaseAuth:' + 4)
            // ユーザーデータ(myApp)が読み込まれていない場合、fireStoreからfetch
            await dispatch('loadMyApp', user.uid).catch(async () => {
              console.log('initFirebaseAuth:' + 5)
              alert('no data registered, load initial dataset')
              await dispatch('initAll', user)
              dispatch('myAppLoadedComplete')
              console.log('initFirebaseAuth: data fetch from fireStore')
            })
          }
          console.log('initFirebaseAuth:success')
          // user オブジェクトを resolve
          resolve(user)
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
    })
  },
  getCurrentLogin () {
    return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged((user) => {
        // user オブジェクトを resolve
        if (user) {
          resolve(user)
        } else {
          reject(new Error('no login'))
        }
        // 登録解除
        unsubscribe()
      })
    })
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
  async fetchFctFromFire ({ commit, dispatch, state }) {
    const fct = await fireGetDoc('dataset', state.myApp.dataSet.fctId)
    if (fct) {
      // ObjectをArrayに変換
      const fctArray = formatFct(fct)
      commit('updateFct', fctArray)
    } else {
      throw new Error('fetchFctFromFire fail: no data')
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
  async fetchDriFromFire ({ commit, dispatch, state }) {
    const dri = await fireGetDoc('dataset', state.myApp.dataSet.driId)
    if (dri) {
      const driArray = formatDri(dri)
      commit('updateDri', driArray)
    } else {
      throw new Error('fetchDriFromFire fail: no data')
    }
  },
  /**
   * PortionUnitのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async fetchPortionUnitFromFire ({ state, commit, dispatch }) {
    // portionUnitをfireStoreからfetch (portionUnitIdを使う)
    const portionUnit = await fireGetDoc('dataset', state.myApp.dataSet.portionUnitId).catch((err) => {
      throw new Error(err)
    })

    // portionUnitをstoreに保存
    if (portionUnit) {
      const portionUnitArray = formatPortionUnit(portionUnit)
      commit('updatePortionUnit', portionUnitArray)
    } else {
      throw new Error('fetchPortionUnitFromFire fail: no data')
    }
  },
  /**
   * cropCalendarのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @param payload 初期値（db名）の指定があれば、これを元に初期化
   * @returns {Promise<void>}
   */
  async fetchCropCalendarFromFire ({ state, commit, dispatch }, payload) {
    if (payload) {
      await commit('updateCropCalendarId', payload)
    }
    // cropCalendarをfireStoreからfetch (cropCalendarIdを使う)
    const cropCalendar = await fireGetDoc('dataset', state.myApp.dataSet.cropCalendarId).catch((err) => {
      throw new Error(err)
    })

    // cropCalendarをstoreに保存
    if (cropCalendar) {
      const cropCalendarArray = Object.values(cropCalendar)
      console.log(cropCalendarArray)
      commit('updateCropCalendar', cropCalendarArray)
    } else {
      throw new Error('fetchCropCalendarFromFire fail: no data')
    }
  },
  /**
   * questionsのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async fetchQuestionsFromFire ({ state, commit, dispatch }) {
    // questionsをfireStoreからfetch (questionsIdを使う)
    const questions = await fireGetDoc('dataset', state.myApp.dataSet.questionsId).catch((err) => {
      throw new Error(err)
    })

    // questionsをstoreに保存
    if (questions) {
      const questionsArray = formatQuestions(questions)
      commit('updateQuestions', questionsArray)
    } else {
      throw new Error('fetchQuestionsFromFire fail: no data')
    }
  },
  async fetchForcedUpdateInfoFromFire ({ state, commit }) {
    // ForcedUpdateInfoをfireStoreからfetch (forcedUpdateInfoIdを使う) → fireGetDocRemoteFirst（サーバー → ローカルの順にデータチェック）
    const forcedUpdateInfo = await fireGetDocRemoteFirst('dataset', state.myApp.dataSet.forcedUpdateInfoId).catch((err) => {
      throw new Error(err)
    })
    if (forcedUpdateInfo) {
      commit('updateForcedUpdateInfo', Object.values(forcedUpdateInfo))
      return Object.values(forcedUpdateInfo)
    } else {
      return []
    }
  },
  /**
   * CountryNamesのデータをfireStoreから取得して返す
   * @param state
   * @returns {Promise<*>}
   */
  async initCountryNames ({ state }) {
    const countries = await fireGetDoc('dataset', state.myApp.dataSet.CountryNamesId).catch((err) => {
      throw new Error(err)
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
  async initRegion ({ state }) {
    const region = await fireGetDoc('dataset', state.myApp.dataSet.regionId).catch((err) => {
      throw new Error(err)
    })
    if (region) {
      return region
    } else {
      throw new Error('initRegion fail: no data')
    }
  },
  /**
   * menuCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param state
   * @param commit
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  initMenu ({ state, commit, dispatch }, payload) {
    const arr = setInitialArray({ key: 2, count: payload.count, data: payload.data })
    commit('updateMenuCases', arr)
  },
  /**
   * prodTargetCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param payload driのセット(array of object)
   * @param state
   * @param commit
   */
  initProdTarget ({ state, commit }, payload) {
    const arr = []
    for (let i = 0; i < state.myApp.sceneCount; i++) {
      const isTargetSingle = false
      const note = ''
      const prodTarget = []
      const target = payload.map(function (dat) {
        return { id: dat.id, count: 0 }
      })
      arr.push({ target, prodTarget, note, isTargetSingle })
    }
    commit('updateProdTargetCases', arr)
  },
  /**
   * feasibilityCasesを初期化（空白ArrayをsetCountの数だけ作成）
   * @param state
   * @param commit
   * @param dispatch
   * @param payload
   */
  initFeasibility ({ state, commit, dispatch }, payload) {
    const arr = setInitialArray({ key: 1, count: payload.count, data: payload.data })
    commit('updateFeasibilityCases', arr)
  },
  initCommunityCases () {

  },
  /**
   * まとめて初期化
   * @param dispatch
   * @param state
   * @param payload
   * @param commit
   */
  async initAll ({ dispatch, state, commit }, payload) {
    if (!payload) {
      throw new Error('Error: initAll → no registered user-info')
    }
    try {
      await commit('initUser', payload)
      await dispatch('fetchFctFromFire')
      await dispatch('fetchDriFromFire')
      await dispatch('fetchPortionUnitFromFire')
      await dispatch('fetchQuestionsFromFire')
      await dispatch('fetchCropCalendarFromFire')
      await dispatch('initMenu', { data: state.myApp.dataSet.dri, count: state.myApp.sceneCount })
      await dispatch('initProdTarget', state.myApp.dataSet.dri)
      await dispatch('initFeasibility', { data: state.myApp.dataSet.dri, count: state.myApp.sceneCount })
      commit('updateDateOfLatestUpdate', 1666909589274)

      // 更新したmyAppをfireStoreに保存
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
  async loadMyApp ({ state, commit }, payload) {
    const myApp = await fireGetDoc('users', payload)
    if (myApp) {
      commit('updateMyApp', myApp)
      // 初期データ読み込み時のみ、hasDocumentChangedをfalseにセット
      commit('setHasDocumentChanged', false)
    } else {
      throw new Error('loadMyApp fail: no data on fireStore')
    }
  },
  async loadMyStore ({ state, commit }, payload) {
    const myApp = await fireGetDoc('users', payload)
    if (myApp) {
      commit('updateMyApp', myApp)
      // 初期データ読み込み時のみ、hasDocumentChangedをfalseにセット
      commit('setHasDocumentChanged', false)
      return true
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
  updateMyApp ({ commit, dispatch }, payload) {
    commit('updateMyApp', payload)
    // myAppの変更時は、常に setHasDocumentChanged=true をセット
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * familyCasesを更新
   * @param commit
   * @param dispatch
   * @param payload
   */
  updateMyFamily: function ({ commit, dispatch }, payload) {
    commit('updateMyFamily', payload)
    // myAppの変更時は、常に setHasDocumentChanged=true をセット
    console.log('updateMyFamily')
    dispatch('setHasDocumentChanged', true)
  },
  /**
   * feasibilityCaseのメモを更新
   * @param commit
   * @param payload
   */
  updateFeasibilityMemo ({ dispatch }, payload) {
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
  fireSaveAppdata ({ state, dispatch }) {
    dispatch('updateSaveDate')
    const ref = doc(firestoreDb, 'users', state.myApp.user.uid)
    setDoc(ref, state.myApp).catch((err) => {
      throw new Error('Error in fireSaveAppdata:' + err)
    })
    // myAppの変更内容をfirestoreに保存できたらhasDocumentChangedをfalseにセット
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
  async fireResetAppdata ({ commit, dispatch }, payload) {
    const res = window.confirm('this will reset all user-data. Are you sure?')
    if (!res) {
      return
    }
    commit('clearMyApp') // 全ての情報を初期化
    await dispatch('initAll', payload).catch((err) => {
      console.log('Error: fireResetAppdata')
      throw err
    })
    commit('initUser', payload) // user情報を戻す
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
  copyAndPasteMyApp ({ commit, dispatch, state }, payload) {
    // payloadがfromId, toIdを含まない場合は停止
    if (!payload.fromId) {
      return
    }
    if (!payload.toId) {
      return
    }
    // fromId, toIdが所定の範囲内から外れる場合は停止
    if (
      !(
        ((payload.fromId >= 100) && (payload.fromId < 100 + state.myApp.sceneCount)) ||
        ((payload.fromId >= 200) && (payload.fromId < 200 + state.myApp.sceneCount))
      ) && (
        ((payload.toId >= 100) && (payload.toId < 100 + state.myApp.sceneCount)) ||
        ((payload.toId >= 200) && (payload.toId < 200 + state.myApp.sceneCount))
      )
    ) {
      return
    }

    const myAppWatcher = JSON.parse(JSON.stringify(state.myApp))
    // copyPattern = 0:家族構成＋食品構成をコピー ,1: 家族構成のみコピー
    let copyPattern = 1

    // range = 0: dietCalk, 1:feasibilityCheckに所属
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
    // 内部変数の初期化
    let fromFamily = ''
    let fromFoodList = ''
    let isTargetSingle = ''
    let note = ''

    // dietCalkの内容をコピー
    if (fromRange === 0) {
      fromFamily = JSON.stringify(myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].target)
      fromFoodList = JSON.stringify(myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].menu)
      isTargetSingle = myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].isTargetSingle
      note = myAppWatcher.menuCases[payload.fromId - 100 * (fromRange + 1)].note
    } else {
      // feasibilityCasedの内容をコピー
      fromFamily = JSON.stringify(myAppWatcher.feasibilityCases[payload.fromId - 100 * (fromRange + 1)].target)
      note = myAppWatcher.feasibilityCases[payload.fromId - 100 * (fromRange + 1)].note
      isTargetSingle = false
    }
    if (toRange === 0) {
      // dietCalkにペースト
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].target = JSON.parse(fromFamily)
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].isTargetSingle = isTargetSingle
      myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].note = note
      if (copyPattern === 0) {
        // 品目リストもあればペースト
        myAppWatcher.menuCases[payload.toId - 100 * (toRange + 1)].menu = JSON.parse(fromFoodList)
      }
    } else {
      // feasibilityCasedにペースト
      myAppWatcher.feasibilityCases[payload.toId - 100 * (toRange + 1)].target = JSON.parse(fromFamily)
      myAppWatcher.feasibilityCases[payload.toId - 100 * (toRange + 1)].note = note
    }
    dispatch('updateMyApp', myAppWatcher)
  }
}
