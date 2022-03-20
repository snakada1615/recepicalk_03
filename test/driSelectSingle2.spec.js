import { mount, createLocalVue } from '@vue/test-utils'
import {afterEach, describe, expect, it} from "@jest/globals";
import driSelectSingle2 from '@/components/organisms/driSelectSingle2.vue'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('driSelectSingle2',  () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  wrapper = mount(driSelectSingle2,{
    localVue,
    propsData:{
      target: [{id: 2, count: 8}],
      items: [
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

  const selectTarget = wrapper.findComponent({ name: 'BFormSelect' })
  const selectTargetOption = selectTarget.findAll('option')
  const DRITable = wrapper.findComponent({ name: 'BTable' })
  const DRITableItem = DRITable.props().items


  it('is a Vue instance', async() => {

    // wrapperが存在する
    expect(wrapper.exists()).toBe(true)

    // <b-table>が表示される
    expect(DRITable.isVisible()).toBeTruthy()
    //expect(wrapper.findAll('div').at(0).text()).toBe('9')

    // <b-form-select>が表示される
    expect(selectTarget.isVisible()).toBeTruthy()

    // 対象グループの初期propertyを確認: ルート
    expect(wrapper.props().target).toEqual([{id: 2, count: 8}])

    // 対象グループの初期propertyを確認: 子コンポーネント
    expect(selectTarget.props().value).toBe(2)

    // 対象グループの初期propertyを確認: 合計値
    expect(wrapper.findComponent({ name: 'BTable' }).props().items[0].Value).toBe("adolescent all") //合計値の変化

    // 対象グループの初期propertyを変更: ルート →　合計値に反映
    wrapper.setProps({ target: [{id: 0, count: 5}] }); //prop変更
    await wrapper.vm.$nextTick()
    expect(DRITable.props().items[0].Value).toBe("child 6-23 month") //合計値の変化

    // 対象グループの初期propertyを確認: 子コンポーネント
    expect(selectTarget.props().value).toBe(0)

    // 対象グループの選択を変更　→　合計値に反映 →　emit →　親コンポーネントがproperty変更すると仮定
    await selectTargetOption.at(1).setSelected() //dropdownリストを選択
    let myEmit = wrapper.emitted('update:target')[1][0][0].id
    expect(myEmit).toEqual(1) // emit
    wrapper.setProps({ target: [{id: myEmit, count: 5}] }); // 親コンポーネントからの戻り値
    expect(DRITableItem[0].Value).toBe("adolescent all")

    // イベントが発行されたかどうか
    //expect(wrapper.emitted('changeNutritionValue')).toBeDefined().toEqual(1)

  })
})
