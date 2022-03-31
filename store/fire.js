import firebase from '~/plugins/firebase'
import {child, get, getDatabase, ref} from "firebase/database";
const db = getDatabase()
const dbRef = ref(db)

export const state = () => ({
  /**
   * ログインしているユーザー
   */
  user:'shun',
  /**
   * 現在のシナリオid（各シナリオに10の食事パターンが存在）
   */
  scene:'test',
  /**
   * fctのテーブル用の値
   */
  fct:[],
  /**
   * driのテーブル用の値
   */
  dri:[]
})
export const getters = {

}
export const mutations = {
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
}
export const actions = {
  /**
   * firebaseからデータを得てfctに代入
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async fireGetFct({ commit, state }) {
    const path = state.user + '/dataset/'
    const dat = await get(child(dbRef, path + 'myFCT01')).catch((err)=>{console.log(err)});
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
  async fireGetDri({ commit, state }) {
    const path = state.user + '/dataset/'
    const dat = await get(child(dbRef, path + 'myDri04')).catch((err)=>{console.log(err)});
    if (!dat.exists()) {
      console.log('no data found')
    }
    commit('updateDri', dat)
  }
}
