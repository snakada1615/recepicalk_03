export default async function ({store, redirect, route}) {
  await store.dispatch('fire/onAuth').then(()=>{
    console.log(store.state.fire.isLoggedIn)
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
  })
}
