<template>
  <div>
    <nav-bar-sub-menu-eth />
    <Nuxt />
  </div>
</template>
<script>
import navBarSubMenuEth from '../components/molecules/navBarSubMenuEth'
export default {
  name: 'DefaultEth',
  components: {
    navBarSubMenuEth
  }
}
</script>
