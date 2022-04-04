<template>
  <b-container>
    <b-navbar type="dark" variant="info" class="mb-2" :sticky=true>
      <b-navbar-brand to="/"><b-icon icon="BIconHouseFill"/><span class="small"> Nutrients App</span></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" :small=true>
        <b-nav-item-dropdown text="Menu" right>
          <b-dropdown-item to="/">top</b-dropdown-item>
          <b-dropdown-item to="/logintest">login</b-dropdown-item>
          <b-dropdown-item to="/test01">test01</b-dropdown-item>
          <b-dropdown-item to="/test02">test02</b-dropdown-item>
          <b-dropdown-item to="/test03">test03</b-dropdown-item>
          <b-dropdown-item to="/test04">test04</b-dropdown-item>
          <b-dropdown-item to="/firetest/dbtest">firestore</b-dropdown-item>
          <b-dropdown-item to="/documents">documents</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item to="#" class="small">user: {{$store.state.fire.user.name}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-nav-text v-if="$nuxt.isOnline" class="text-light small"><b-icon icon="reception4"/></b-nav-text>
      <div v-if="$nuxt.isOffline" class="text-light small"><b-icon icon="reception0"/></div>
    </b-navbar>
  </b-container>
</template>
