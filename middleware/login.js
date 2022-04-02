export default async function ({store, redirect, route}) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   */
  console.log('middleware login')
  await store.dispatch('fire/initFirebaseAuth')
  console.log(store.state.fire.isLoggedIn)
  if (
    route.name !== 'logintest'
    && route.name !== 'index'
    && !store.state.fire.isLoggedIn
  ) {
    alert('please login/register first')
    console.log('not login')
    return redirect('/')
  } else {
    console.log('autologin complete:')
  }
}
