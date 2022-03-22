FctTableModal example:

```vue
<template>
  <b-jumbotron bg-variant="light" border-variant="primary">
    <FctTableModal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :items="fctItems"
      @modalOk="onItemSelected"
    ></FctTableModal>
    <div>selecetd item</div>
    <ul>
      <li>Name: {{selectedCrop.Name}}</li>
      <li>Group: {{selectedCrop.Group}}</li>
      <li>Energy: {{selectedCrop.En}}</li>
      <li>Protein: {{selectedCrop.Pr}}</li>
    </ul>
    <b-button
      @click="oncClick"
      variant="info"
    >open dialog</b-button>
  </b-jumbotron>
</template>
<script>
  export default {
    data(){
      return {
        test:false,
        showFCT:true,
        selectedCrop:{},
        fctItems:[
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
    },
    methods:{
      oncClick(){
        this.$bvModal.show('modalTest')
      },
      onItemSelected(rec){
        this.selectedCrop = {
          'id': rec.id,
          'Name': rec.Name,
          'Group': rec.Group,
          'En': rec.En,
          'Pr': rec.Pr,
          'Va': rec.Va,
          'Fe': rec.Fe,
        }
      }
    }
  }

</script>
```
