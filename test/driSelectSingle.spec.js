import { mount, createLocalVue } from '@vue/test-utils'
import driSelectSingle from '@/components/organisms/driSelectSingle.vue'
import BootstrapVue from "bootstrap-vue"

const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('driSelectSingle', () => {
  let wrapper;

  afterEach(() => {
    wrapper.destroy();
  });

  wrapper = mount(driSelectSingle,{
    localVue,
    propsData: {
      target: [{ id: 1, count: 1}],
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
      ],
    }
  });
  let myHtml = wrapper.html()

  test('is a Vue instance', () => {
    // wrapperが存在する
    expect(wrapper.exists()).toBe(true);

    //propertyの確認
    expect(wrapper.props().target[0].count).toBe(1);

    //出力値の確認
    expect(wrapper.findComponent('.totalDri').element).toBe(100)

    //propertyの変更
    wrapper.setProps({ target: [{id: 0, count: 8}] });

  })
})
