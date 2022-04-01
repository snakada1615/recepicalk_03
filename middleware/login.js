export default async function ({store, redirect, route}) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   */
  console.log('middleware login')
  await store.dispatch('fire/initFirebaseAuth')
  if (
    route.name !== 'login'
    && !store.state.fire.isLoggedIn
  ) {
    alert('please login/register first')
    console.log('not login')
    return redirect('/login')
  } else {
    console.log('autologin complete:')
  }
}
