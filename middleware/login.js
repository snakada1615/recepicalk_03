export default async function ({store, redirect, route}) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   * ログイン○、myAppのfetch×、の場合にはfireStoreからfetch(initFirebaseAuthの機能)
   */
  console.log('middleware: Check login status')
  await store.dispatch('fire/initFirebaseAuth').catch(()=>{
    //console.log(err)
    console.log('login-middleware: Error')
  })
  if (
    route.name !== 'login'
    && route.name !== 'index'
    && !store.state.fire.isLoggedIn
  ) {
    alert('please login/register first')
    console.log('not login')
    return redirect('/')
  } else {
    if (store.state.fire.isLoggedIn){
      // 初期化されていない変数があった場合、firebaseからオリジナル変数をダウンロードして際読み込む
      // （下位互換のための例外措置）
      await store.dispatch('fire/initFirebaseNewVariable')
    }
    console.log('autologin complete:')
  }
}
