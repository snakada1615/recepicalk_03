import { mount, createLocalVue } from '@vue/test-utils'
import {afterEach, describe, expect, it} from "@jest/globals";
import driSelectSingle from '@/components/molecules/driSelectSingle.vue'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('driSelectSingle',  () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  wrapper = mount(driSelectSingle,{
    localVue,
    propsData:{
      target: [{id: 1, count: 8}],
      driItems: [
        {
          En: "1088.0",
          Fe: "5.8",
          max_vol: "900",
          Name: "child 6-23 month",
          Pr: "11.65",
          Va: "400.0",
          id: 0
        },
        {
          En: "3066.0",
          Fe: "44.4",
          max_vol: "2500",
          Name: "lactating",
          Pr: "61.0",
          Va: "850.0",
          id: 1
        },
        {
          En: "2913.0",
          Fe: "24.9",
          max_vol: "2600",
          Name: "adolescent all",
          Pr: "52.65",
          Va: "600.0",
          id: 2
        }
      ]
    }
  })

  const selectTarget = wrapper.findComponent('.jest_select')
  const DRITable = wrapper.findComponent('.jest_table')


  it('is a Vue instance', async() => {

    // wrapperが存在する
    expect(wrapper.exists()).toBe(true)

    // <b-table>が表示される
    expect(DRITable.isVisible()).toBeTruthy()

    // <b-form-select>が表示される
    expect(selectTarget.isVisible()).toBeTruthy()

    // 対象グループの初期propertyを確認: ルート
    expect(wrapper.props().target).toEqual([{id: 1, count: 8}])

    // 対象グループの初期propertyを確認: 子コンポーネント
    expect(selectTarget.props().value).toEqual(1)

    // 対象グループの初期propertyを変更: ルート →　合計値に反映
    await wrapper.setProps({ target: [{id: 2, count: 1}] }); //prop変更
    let DRITotal = DRITable.props().items
    expect(DRITotal[0].Value).toBe("adolescent all") //合計値の変化

    // 対象グループの選択を変更　→　合計値に反映 →　emit →　親コンポーネントがproperty変更すると仮定
    //await myOption.at(0).setSelected() //dropdownリストを選択
    //await wrapper.vm.$nextTick()
    //expect(wrapper.emitted('changeNutritionValue')).toBe(1)
    //let myEmit = wrapper.emitted('update:target')[0][0][0].id
    //expect(myEmit).toEqual(1) // emit
    await wrapper.setProps({ target: [{id: 0, count: 1}] }); // 親コンポーネントからの戻り値
    DRITotal = DRITable.props().items
    expect(DRITotal[0].Value).toBe("child 6-23 month")

    // イベントが発行されたかどうか
    //expect(wrapper.emitted('changeNutritionValue')).toBeDefined().toEqual(1)

  })
})
