<template>
  <b-container>
    <b-row>
      <b-col cols="12" lg="6">
        <b-card title="Comparison of Diet assessment">

        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card title="Dietary diversity">
          <b-table
            bordered
            small
            :items="diversityStatus"
            :fields="fieldsDiversity"
          >
          </b-table>
        </b-card>
      </b-col>
      <b-col cols="12" lg="12">
        <b-card title="Key nutrient sufficiency">
          <b-row>
            <b-col cols="6" v-for="pageId in sceneCount" :key="pageId">
              <b-card>
                Case{{ pageId }}
                <nutrition-bar
                  v-for="index in 4" :key="index"
                  :col-width-first=2
                  :col-width-second=2
                  :label="nutritionLabel[index-1]"
                  :max-rating="maxRating"
                  :rating="ratingGetter[pageId-1][nutritionLabel[index-1]]"
                />
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="12">
        <b-card title="Key Nutrient Balance">

        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import nutritionBar from "@/components/molecules/nutritionBar";

export default {
  components: {
    nutritionBar
  },
  computed: {
    myApp:function(){
      return this.$store.state.fire.myApp
    },
    sceneCount:function(){
      return this.$store.state.fire.myApp.sceneCount
    },
    /**
     * FCTからfood Groupを抽出
     * @returns {*}
     */
    foodGroup() {
      return this.myApp.dataSet.fct.reduce((accumulator, dat) => {
        if (accumulator.indexOf(dat.Group) < 0) {
          accumulator.push(dat.Group)
        }
        return accumulator
      }, [])
    },
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      return this.myApp.menuCases.map((foodsTemp, index) => {
        let res = {}
        let colorVariant = {}
        res['case']= 'Case' + (index + 1)
        colorVariant['case'] = 'primary'
        vm.foodGroup.forEach((foodItem)=>{
          res[foodItem] = ''
          colorVariant[foodItem] = 'danger'
        })
        foodsTemp.menu.forEach((dat1) => {
          if (vm.foodGroup.indexOf(dat1.Group) >= 0) {
            colorVariant[dat1.Group] = 'info'
          }
        })
        res['_cellVariants'] = colorVariant
        return res
      })
    },
    /**
     * myApp.menuCases.targetの値を集計してnutritionDemandWatcherに代入するための関数
     * @returns {*[]} 栄養素必要量の合計値
     */
    nutritionDemandGetter() {
      const vm = this
      return vm.myApp.menuCases.map((dat) => {
        return dat.target.reduce((accumulator, item, index) => {
          const dri = vm.myApp.dataSet.dri[index]
          const count = item.count
          accumulator.En += Number(count) * Number(dri.En)
          accumulator.Pr += Number(count) * Number(dri.Pr)
          accumulator.Va += Number(count) * Number(dri.Va)
          accumulator.Fe += Number(count) * Number(dri.Fe)
          accumulator.Wt += Number(count) * Number(dri.Wt)
          return accumulator
        }, {
          'En': 0,
          'Pr': 0,
          'Va': 0,
          'Fe': 0,
          'Wt': 0,
        })
      })
    },
    /**
     * myApp.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter() {
      const vm = this
      return vm.myApp.menuCases.map((datArray) => {
        if (datArray.menu.length > 0) {
          return datArray.menu.reduce((accumulator, item) => {
            accumulator.En += Number(item.En)
            accumulator.Pr += Number(item.Pr)
            accumulator.Va += Number(item.Va)
            accumulator.Fe += Number(item.Fe)
            accumulator.Wt += Number(item.Wt)
            accumulator.Carbohydrate += Number(item.Carbohydrate)
            accumulator.Fat += Number(item.Fat)
            return accumulator
          }, {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          })
        } else {
          return {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          }
        }
      })
    },
    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter() {
      const res = []
      for (let i = 0; i < this.sceneCount; i++) {
        const supply = this.nutritionSupplyGetter[i]
        const demand = this.nutritionDemandGetter[i]
        res.push({
          En: demand.En ?
            Math.round(100 * supply.En * this.driRange / demand.En) / 10 : 0,
          Pr: demand.Pr ?
            Math.round(100 * supply.Pr * this.driRange / demand.Pr) / 10 : 0,
          Va: demand.Va ?
            Math.round(100 * supply.Va * this.driRange / demand.Va) / 10 : 0,
          Fe: demand.Fe ?
            Math.round(100 * supply.Fe * this.driRange / demand.Fe) / 10 : 0
        })
      }
      return res
    },
  },
  data() {
    return {
      /**
       * Dietary Diversityのフィールド定義
       */
      fieldsDiversity:[
        {key:'case', label:'Case'},
        {key:'Grains@ roots and tubers ', label:'F1'},
        {key:'Vitamin A rich fruits and Vegetable ', label:'F2'},
        {key:'Legumes and nuts ', label:'F3'},
        {key:'Other fruits and vegetables ', label:'F4'},
        {key:'Flesh foods ', label:'F5'},
        {key:'Eggs ', label:'F6'},
        {key:'Dairy products ', label:'F7'},
        {key:'non-category', label:'F8'},
      ],
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
      /**
       * ratingを計算するにあたって、同一メニューを一日3回食べると仮定した場合の評価、
       *     (recepiTableの値×3)、または1回分が一日の栄養素に与える影響の評価を
       *     切り替える
       * @returns {number}
       */
      driRange: 1,
    }
  },
}
</script>
