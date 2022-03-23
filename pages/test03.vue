<template>
  <b-jumbotron bg-variant="light" border-variant="primary">
    <b-card class="my-2">
      <b-row>
        <b-col cols="3">Name:</b-col><b-col>{{cropInfo[0].Name}}</b-col>
      </b-row>
      <b-row>
        <b-col cols="3">Group:</b-col><b-col>{{cropInfo[0].Food_grp}}</b-col>
      </b-row>
      <b-row>
        <b-col cols="3">En:</b-col><b-col cols="3">Pr:</b-col>
        <b-col cols="3">Va:</b-col><b-col cols="3">Fe:</b-col>
        <b-col cols="3">{{(cropInfo[0].En * itemWeight / 100).toFixed(1)}}</b-col>
        <b-col cols="3">{{(cropInfo[0].Pr * itemWeight / 100).toFixed(1)}}</b-col>
        <b-col cols="3">{{(cropInfo[0].Va * itemWeight / 100).toFixed(1)}}</b-col>
        <b-col cols="3">{{(cropInfo[0].Fe * itemWeight / 100).toFixed(1)}}</b-col>
      </b-row>
      <b-row>
        <b-col cols="3" class="text-danger">Weight:</b-col><b-col class="text-danger">{{ itemWeight }}</b-col>
      </b-row>
    </b-card>

    <food-modal
      v-model="itemWeight"
      :items="cropInfo"
      :max-weight=500
      my-name="modalTest"
      my-type="Number"
      rules="min_value:0|max_value:500"
      @input="(val)=>itemWeight = val"
      @modalOk="onOk"
    ></food-modal>

    <b-button
      @click="oncClick"
    >change weight</b-button>

  </b-jumbotron>
</template>
<script>
import foodModal from "../components/organisms/foodModal";

export default {
  components:{
    foodModal
  },
  data(){
    return {
      itemWeight:0,
      modalName: 'modal01',
      cropInfo:[
        {
          Carbohydrate: "67.9",
          En: "315",
          Fe: "1.9",
          Fat: "0.4",
          Food_grp: "Starchy roots, tubers and their products",
          Name: "Yam tuber, flour",
          Pr: "3.4",
          Va: "",
          Group: "Grains, roots and tubers",
          food_grp_id: "2",
          id: "110",
        },
      ],
    }
  },
  methods:{
    oncClick(rec){
      this.$bvModal.show('modalTest')
    },
    onOk(val){
      console.log(val)
    }
  }
}

</script>
