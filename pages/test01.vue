<template>
  <b-container>
    <fct-table-modal2
      :show-modal="modalFlag"
      :items="items"
      :menu-cases.sync="myMenu"
      :portion-units="portionList"
      my-name="shunModal"
    />
    <b-button
      @click="modalFlag =!modalFlag"
    >halo</b-button>
  </b-container>
</template>

<script>
import FctTableModal2 from "@/components/organisms/FctTableModal2";

export default {
  components: {
    FctTableModal2,
  },
  data: function () {
    return {
      items : [
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
      ],
      myMenu : [
        {
          Carbohydrate: "99.9",
          En: "99",
          Fe: "9.9",
          Fat: "0.9",
          Name: "YamYam",
          Pr: "3.9",
          Va: "",
          Group: "Grains, roots and tubers",
          food_grp_id: "2",
          id: "106",
          Wt: 128,
          menuName: "breakfast"
        },
      ],
      modalFlag: false,
      portionList: [
        {
          'FCT_id': '1043',
          'id': '1',
          'count_method': 'small cup',
          'unit_weight': 50,
        },
        {
          'FCT_id': '4156',
          'id': '2',
          'count_method': 'small',
          'unit_weight': 20,
        },
        {
          'FCT_id': '4156',
          'id': '3',
          'count_method': 'medium',
          'unit_weight': 50,
        }
      ],
    }
  },
}
</script>
