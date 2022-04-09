<template>
  <b-container class="my-0">
    <b-row class="my-0" align-v="center">
      <b-col :cols="colWidthFirst" class="px-0 d-flex justify-content-center">
        <div>{{ cropName }}</div>
      </b-col>
      <b-col :cols="colWidthSecond" class="px-0 d-flex justify-content-center">
        <div v-show="showDri" >{{ nutritionTarget }}</div>
      </b-col>
      <b-col class="px-0 d-flex justify-content-start">
        <fa-rating :glyph="myicon"
                   :item-size="20"
                   :spacing="-5"
                   :border-width="0"
                   active-color="#FF3333"
                   inactive-color="#cfcfcf"
                   :increment="increment"
                   :max-rating="max"
                   :read-only="true"
                   v-model="rating">
        </fa-rating>
        <div v-show="showReset" class="mx-2"><a href="#" @click.prevent="rating = 0">Reset</a></div>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
  import {FaRating} from 'vue-rate-it';
  import stop from 'vue-rate-it/glyphs/stop';
  import navicon from 'vue-rate-it/glyphs/navicon';

  export default {
    components: {
      FaRating
    },
    props: {
      /**
       * show reset button
       */
      showReset: {
        type: Boolean,
        default: false,
      },
      /**
       * show number next to barchart
       */
      showDri: {
        type: Boolean,
        default: true,
      },
      /**
       * actual score shown on barchart (relative value between [0, max])
       */
      rating: {
        type: Number,
        default: 5
      },
      /**
       * max value of barchart (relative value)
       */
      max: {
        type: Number,
        default: 10
      },
      /**
       * increment shown on the barchart
       */
      increment: {
        type: Number,
        default: 0.1
      },
      /**
       * icon ID used for barchart renderig
       */
      iconNum: {
        type: Number,
        default: 1
      },
      /**
       * label shown at left side of barchart
       */
      cropName: {
        type: String,
        required: true
      },
      /**
       * absolute value equivalent to max
       */
      nutritionTarget: {
        type: Number,
        default: 0
      },
      colWidthFirst: {
        type: Number,
        default: 3
      },
      colWidthSecond: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        myicon: '', // declare the icon
      }
    },
    created() {
      this.myicon = stop
    },
    methods: {
      setIcon(index) {
        switch (index) {
          case 1:
            this.myicon = navicon
            break;
          case 2:
            this.myicon = apple
            break;
          case 3:
            this.myicon = ThumbsUp
            break;
          default:
            this.myicon = navicon
            break;
        }
      }
    },
  }
</script>
