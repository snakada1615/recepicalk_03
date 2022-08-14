<template>
  <b-container>
    <div>test</div>
    <diet-calk-display-eth
      :my-family="myFamily"
    />
  </b-container>
</template>

<script>
import dietCalkDisplayEth from "../components/organisms/dietCalkDisplayEth";

export default {
  components: {
    dietCalkDisplayEth
  },
  data() {
    return {
      myFamily: {
        myCrops: [
          {id:"1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196", menuName: "Curry"},
          {id:"2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208", menuName: "Oyako-don"}
        ],
        myMember: [
          {id: 1, count: 1},
          {id: 2, count: 0},
          {id: 3, count: 2}
        ],
        myDri: [
          {
            En: "1088.0",
            Fe: "5.8",
            max_vol: "900",
            Name: "child 6-23 month",
            Pr: "11.65",
            Va: "400.0",
            id: 1
          },
          {
            En: "3066.0",
            Fe: "44.4",
            max_vol: "2500",
            Name: "lactating",
            Pr: "61.0",
            Va: "850.0",
            id: 2
          },
          {
            En: "2913.0",
            Fe: "24.9",
            max_vol: "2600",
            Name: "adolescent all",
            Pr: "52.65",
            Va: "600.0",
            id: 3
          }
        ],
        myFct: [
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
          {
            Carbohydrate: "58.9",
            En: "380",
            Fe: "3.3",
            Fat: "5.9",
            Food_grp: "Legumes and their products",
            Name: "Bambara groundnut, dried ",
            Pr: "20.1",
            Va: "2",
            Group: "Legumes and nuts ",
            food_grp_id: "3",
            id: "111",
          },
          {
            Carbohydrate: "20.3",
            En: "562",
            Fe: "3.7",
            Fat: "43.2",
            Food_grp: "Nuts, seeds and their products",
            Name: "Groundnut, rose",
            Pr: "20.4",
            Va: "0",
            Group: "Legumes and nuts ",
            food_grp_id: "6",
            id: "273",
          }
        ]
      }
    }
  },
}

</script>
