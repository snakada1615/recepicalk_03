<template>
  <section class="container" style="max-width: 540px;">
    <div>
      <b-carousel
        id="carousel-fade"
        fade
        indicators
        img-width="1024"
        img-height="480"
      >
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro01.jpg"
        />
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro02.jpg"
        />
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro03.jpg"
        />
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro04.jpg"
        />
      </b-carousel>
    </div>
    <b-row>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
          <b-card-body class="px-0 py-0">
            <b-card-text class="text-center font-weight-bold text-secondary bg-white">
              about NFA tool
            </b-card-text>
            <b-button class="btn-warning btn-block" to="/whatsNFA" nuxt>
              What is this tool?
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
          <b-card-body class="px-0 py-0">
            <b-card-text class="text-center font-weight-bold text-secondary bg-white">
              family assessment
            </b-card-text>
            <b-button :disabled="!$store.state.fire.isLoggedIn" class="btn btn-warning m-auto btn-block" to="/ethFamilyAssessment" nuxt>
              go
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
          <b-card-body class="px-0 py-0">
            <b-card-text class="text-center font-weight-bold text-secondary bg-white">
              community assessment
            </b-card-text>
            <b-button :disabled="!$store.state.fire.isLoggedIn" class="btn btn-warning m-auto btn-block" to="/ethCommunityAssessment" nuxt>
              go
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
          <b-card-body class="px-0 py-0">
            <b-card-text class="text-center font-weight-bold text-secondary bg-white">
              change user
            </b-card-text>
            <b-button class="btn btn-warning m-auto btn-block" to="/login" nuxt>
              login / logout
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-card>
      note: this app is under frequent update. if you have any trouble, please go to option.
      and try to 'delete user data' and start again using new data set
    </b-card>
  </section>
</template>

<script>
export default {
  layout: 'defaultEth'
}
</script>
