import { mount, createLocalVue } from '@vue/test-utils';
import {afterEach, describe, expect, it} from "@jest/globals";
import driSelectMulti from '@/components/molecules/driSelectMulti.vue'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('driSelectMulti',  () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  wrapper = mount(driSelectMulti,{
    localVue,
    propsData:{
      target: [{id: 1, count: 8}],
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

  const DRITable = wrapper.findAllComponents({ name: 'BTable' })
  const TargetNumber = wrapper.findAllComponents('input')


  it('is a Vue instance', async() => {

    // wrapperが存在する
    expect(wrapper.exists()).toBe(true)

    // <TargetNumber>が表示される
    expect(DRITable.at(1).isVisible()).toBeTruthy()

    // <b-table>が表示される
    expect(DRITable.at(0).isVisible()).toBeTruthy()

    // 対象グループの初期値を確認: ルート
    expect(wrapper.props().target).toEqual([{id: 1, count: 8}])

    // イベントが発行されたかどうか
    //expect(wrapper.emitted('update:driPopulations')).toBeDefined()

    // 対象グループの初期値を確認: ルート →　子コンポーネント
    expect(DRITable.at(0).props().items[1].number).toBe(8)

    // 対象グループの選択を変更　→　合計値に反映
    //人数変更
    await TargetNumber.at(0).setValue(3)
    await TargetNumber.at(1).setValue(5)

    //イベントが発火したかどうか
    expect(wrapper.emitted('update:target')[1][0][1].count).toBe(5)
    expect(TargetNumber.at(0).element.value).toBe("3")

    // 対象グループの初期値を確認: ルート
    expect(wrapper.props().target).toEqual([{id: 1, count: 8}])


    //合計値が変化したか
    //expect(DRITable.at(1).props().items[1].Value).toBe(24528)

  })
})
