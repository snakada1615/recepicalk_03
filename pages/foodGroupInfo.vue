<template>
  <b-container>
    <b-form-select
      v-model="selectedFoodGroup"
      :options="foodGroupList"
    />
    <b-card
      bg-variant="light"
      :title="allCrops[selectedFoodGroup].groupName">
      {{ allCrops[selectedFoodGroup].groupDescription }}
      <b-row>
        <b-col cols="12" md="6" lg="4" v-for="index in selectedFoodList.length" :key="index">
          <b-card
            :title="selectedFoodList[index-1].name"
            style="max-width: 20rem;"
            bg-variant="success"
            class="my-1"
          >
            <b-img
              fluid
              thumbnail
              center
              style="max-height: 10rem;"
              alt="Image missing"
              :src="selectedFoodList[index-1].picture"
            />
            <b-card-text>
              {{ selectedFoodList[index - 1].description }}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      allCrops: [
        {
          groupName: 'Staples',
          groupDescription: 'food group description here...',
          foodList: [
            {
              'name': 'barley',
              description: 'description here......',
              picture: '/img/crops/barley.png'
            },
            {
              'name': 'broad bean',
              description: 'description here......',
              picture: '/img/crops/broad_bean.png'
            },
            {
              'name': 'cassava',
              description: 'description here......',
              picture: '/img/crops/cassava.png'
            },
            {
              'name': 'enset',
              description: 'description here......',
              picture: '/img/crops/enset.png'
            },
            {
              'name': 'lentil brown',
              description: 'description here......',
              picture: '/img/crops/lentil_brown.png'
            },
            {
              'name': 'lentil green',
              description: 'description here......',
              picture: '/img/crops/lentil_green.png'
            },
            {
              'name': 'lentil red',
              description: 'description here......',
              picture: '/img/crops/lentil_red.png'
            },
            {
              'name': 'maize',
              description: 'description here......',
              picture: '/img/crops/maize.png'
            },
            {
              'name': 'soybean',
              description: 'description here......',
              picture: '/img/crops/soybean.png'
            },
            {
              'name': 'sorghum',
              description: 'description here......',
              picture: '/img/crops/sorghum.png'
            },
            {
              'name': 'teff',
              description: 'description here......',
              picture: '/img/crops/teffgrain.jpeg'
            }
          ]
        }
      ],
      selectedFoodGroup: 0
    }
  },
  computed: {
    selectedFoodList() {
      return this.allCrops[this.selectedFoodGroup].foodList
    },
    foodGroupList() {
      return this.allCrops.map((item, index)=>{
        return {
          value: index,
          text: item.groupName
        }
      })
    }
  }
}
</script>
