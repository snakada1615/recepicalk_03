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
          groupDescription: 'Cereal grains such as teff, barley, maize, sorghum,\n' +
            'root crops and tubers such as enset and cassava are the major\n' +
            'staple foods in Ethiopia. Cereal grains and root crops are good\n' +
            'sources of energy, plant protein, B vitamins, minerals and dietary\n' +
            'fibre, particularly when wholegrains are eaten such as darkcoloured barley and oats. Consumption of wholegrains lowers the\n' +
            'risk of CVD mortality and improves gut health [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'teff',
              description: 'description here......',
              picture: '/img/crops/teffgrain.jpeg'
            },
            {
              'name': 'maize',
              description: 'description here......',
              picture: '/img/crops/maize.png'
            },
            {
              'name': 'barley',
              description: 'description here......',
              picture: '/img/crops/barley.png'
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
              'name': 'sorghum',
              description: 'description here......',
              picture: '/img/crops/sorghum.png'
            },
          ],
        },
        {
          groupName: 'Legumes/ pulses',
          groupDescription: 'such as peas, lentils, broad beans and soya beans\n' +
            'are good sources of proteins, minerals and vitamins. Those\n' +
            'with more proteins such as beans and peas combat proteinenergy malnutrition while also providing other nutrients. Eating\n' +
            'legumes lowers your BMI, slows down weight gain over time\n' +
            'and decreases occurrence of CVD and T2DM [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'broad bean',
              description: 'description here......',
              picture: '/img/crops/broad_bean.png'
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
              'name': 'soybean',
              description: 'description here......',
              picture: '/img/crops/soybean.png'
            },
          ]
        },
        {
          groupName: 'Nuts and Oilseeds',
          groupDescription: 'good sources of minerals and\n' +
            'unsaturated fat. Common nuts and oilseeds in Ethiopia include\n' +
            'groundnuts, sunflower seeds, sesame seeds and Niger seeds.\n' +
            'Nuts and oilseeds are very good sources of vitamins with antioxidative properties such as vitamin E and beta-carotene.\n' +
            'Adding sunflower seeds and peanuts in kolo (roasted cereals\n' +
            'and legumes served as a snack) is already well-established in\n' +
            'Ethiopia. It should be encouraged as a wider practice. Sesame\n' +
            'seeds have a high antioxidant content (vitamin E and betacarotene) than other oilseeds. Eating 15–30 grams of nuts every\n' +
            'day reduces CVD risk [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'peanuts',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'sunflower seeds',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'Niger seeds',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
          ]
        },
        {
          groupName: 'Milk and milk products',
          groupDescription: 'Animal milk, yoghurt and cheese are\n' +
            'good sources of energy and nutrients (such as fat, protein and\n' +
            'minerals, for forming strong bones and teeth), and of vitamin A\n' +
            'that is excellent for sound vision. Milk and milk products combat\n' +
            'child stunting. [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'milk',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'cheese',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
          ]
        },
        {
          groupName: 'Meat, poultry, eggs, and fish',
          groupDescription: 'ASFs such as meat, poultry, eggs\n' +
            'and fish are very good sources of high-quality (complete) protein\n' +
            'and vital micronutrients such as iron, zinc and vitamin B12.\n' +
            'Meat consumption helps improve the iron status. But processed meat (such as canned beef,\n' +
            'sausage), though not common in Ethiopia’s consumption, is associated with T2DM and CVD.\n' +
            'Fish is also rich in healthy fats (omega fatty acids)\n' +
            'Moderate fish consumption (2–3 servings per week) is associated with a lower coronary heart\n' +
            'disease (CHD) risk. Long-chain polyunsaturated fatty acids, protein, iodine and selenium are\n' +
            'abundant in fish. [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'meat',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'poultry',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'eggs',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'fish',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
          ]
        },
        {
          groupName: 'Fruits and vegetables',
          groupDescription: 'Fruits such as papayas, avocados,\n' +
            'mangoes and bananas are excellent sources of pro-vitamin A\n' +
            'carotenoids, vitamin C and minerals. Vegetables such as kale,\n' +
            'broccoli, cauliflower and beetroot also have important vitamins and minerals needed for our\n' +
            'health. Consumption of fruits and vegetables can help combat multiple nutrient deficiencies. [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'tomato',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'onion',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'kale',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'carrot',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'broccoli',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'cauliflower',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'beetroots',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'papaya',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'avocados',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'mango',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
            {
              'name': 'banana',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
          ]
        },
        {
          groupName: 'Fats and Oils',
          groupDescription: 'The fats and oils food group consists of different types\n' +
            'of fatty acids: those which are solid at room temperature are saturated\n' +
            'fatty acids while those which are liquid are unsaturated fatty acids. Fats\n' +
            'are concentrated sources of energy: for example, one spoon of cooking\n' +
            'oil contains twice as much energy as one spoon of starch or one spoon\n' +
            'of sugar. Fats contain fatty acids needed for growth. Fats also help the\n' +
            'absorption of certain vitamins such as vitamin A. [source:Food-based dietary guidelines - Ethiopia]',
          foodList: [
            {
              'name': 'Oil',
              description: 'description here......',
              picture: '/img/crops/food_icon.png'
            },
          ]
        },
      ],
      selectedFoodGroup: 0
    }
  },
  computed: {
    selectedFoodList() {
      return this.allCrops[this.selectedFoodGroup].foodList
    },
    foodGroupList() {
      return this.allCrops.map((item, index) => {
        return {
          value: index,
          text: item.groupName
        }
      })
    }
  }
}
</script>
