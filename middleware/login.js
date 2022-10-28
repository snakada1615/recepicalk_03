export default async function ({ store, redirect, route }) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   * ログイン○、myAppのfetch×、の場合にはfireStoreからfetch(initFirebaseAuthの機能)●
   */
  console.log('middleware: Check login status')
  await store.dispatch('fire/initFirebaseAuth').catch((err) => {
    console.log(err)
    console.log('login-middleware: Error')
    alert('please login/register first to use all function')
  })
  if (
    route.name !== 'login' &&
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
      // 初期化されていない変数があった場合、firebaseからオリジナル変数をダウンロードして際読み込む
      // （下位互換のための例外措置）
      await store.dispatch('fire/initFirebaseNewVariable')

      // 特定の地域に対してdbの更新が必要かどうか判定して登録
      await store.dispatch('fire/checkUpdate')

      // 特定の地域に対して適用するdbを指定
      // await store.dispatch('fire/forcedUpdate')

      /*
      if ((route.name === 'changeCurrentDataset') && store.state.fire.myApp.user.userType !== 'admin'){
        alert('you need to have admin status to enter this page')
        return redirect('/startPageEth')
      }
*/
    }
    console.log('autologin complete:')
  }
}
