
export default async function ({ store, redirect, route }) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   * ログイン○、myAppのfetch×、の場合にはfireStoreからfetch(initFirebaseAuthの機能)●
   */
  console.log('middleware: Check login status')
  const user = await store.dispatch('fire/getCurrentLogin').catch((err) => {
    console.error(err)
    alert('please login/register first to use all function')
  })
  if (user) {
    // ログイン状態を更新
    await store.dispatch('fire/updateIsLoggedIn', true)

    // firebaseからmyAppを読み込む（キャッシュから優先）
    await store.dispatch('fire/loadMyStore', user.uid).catch((err) => {
      console.error(err)
      alert('no data is recorded for this user. please register another user again')
    })
  }
  if (
    route.name !== 'login' &&
    route.name !== 'userReg' &&
    route.name &&
    route.name !== 'index' &&
    route.name !== 'startPageEth' &&
    route.name.indexOf('test') &&
    !store.state.fire.isLoggedIn
  ) {
    alert('please login/register first')
    console.log('not login')
    // エチオピア版の場合は startPageEth に飛ぶ
    if (route.name.includes('eth')) {
      return redirect('/startPageEth')
    } else {
      return redirect('/')
    }
  } else {
    if (store.state.fire.isLoggedIn) {
      // 特定の地域に対してdbの更新が必要かどうか判定して更新情報を登録
      await store.dispatch('fire/checkUpdate')
    }
    console.log('autologin complete:')
  }
}
