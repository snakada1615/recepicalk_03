<template>
  <b-container>
    <diet-calk-display-eth
      :my-family="myFamily"
    />
  </b-container>
</template>
<script>
import dietCalkDisplayEth from "./dietCalkDisplayEth";

export default {
  components: {
    dietCalkDisplayEth,
  },
  computed: {
    myApp: function () {
      return this.myFamilyCase
    },
    myFamily:function(){
      return {
        myCrops: this.myFamilyCase.menuCases[0].menu,
        myMember: this.myFamilyCase.member,
        myFct: this.myFct,
        myDri: this.myDri
      }
    },
  },
  data() {
    return {

    }
  },
  props: {
    myFamilyCase: {
      type: Object,
      required: true,
    },
    myDri: {
      type: Array,
      required: true,
    },
    myFct: {
      type: Array,
      required: true,
    },
    mySceneCount: {
      type: Number,
      required: true,
    },
  },
  methods: {

  }
}
</script>
