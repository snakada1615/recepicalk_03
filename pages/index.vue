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
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro02.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro03.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro04.jpg"
        ></b-carousel-slide>
      </b-carousel>
    </div>
    <b-button to="login" variant="info">sign in</b-button>


    <b-card>
      note: this app is under frequent update. if you have any trouble, please go to option.
      and try to 'delete user data' and start again using new data set
    </b-card>
  </section>
</template>

<script>
export default {
}
</script>
