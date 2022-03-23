import {mount, createLocalVue, createWrapper} from '@vue/test-utils';
import {afterEach, describe, expect, it} from "@jest/globals";
import test from '@/components/test.vue'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('test', () => {
  it("test", async () => {
    const wrapper = mount(test, {
      localVue
    })

    const button = wrapper.find('#openButton')
    const modal = wrapper.find('#baka');
    expect(button.exists()).toBe(true);
    expect(modal.exists()).toBe(true);

    expect(modal.isVisible()).toBe(false);
    button.trigger('click');

    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(true);
      done();
    });


    expect(wrapper.isVueInstance()).toBe(true);
    const rootWrapper = createWrapper(wrapper.vm.$root)
    //rootWrapper.$emit('bv::show::modal', 'baka')

    //const rootWrapper = createWrapper(wrapper.vm.$root)
    //rootWrapper.$emit('bv::show::modal', 'testModal')

    // イベントが発行されたかどうか
    expect(rootWrapper.emitted()).toBe(1)
    //expect(rootWrapper.emitted('bv::show::modal')).toBeDefined()
    // イベントの実行回数
    //expect(rootWrapper.emitted('bv::show::modal').length).toBe(1)
    // イベントのペイロードを検証
    //expect(rootWrapper.emitted('bv::show::modal')[0]).toBe(['testModal']);

    console.log(wrapper)
    //const modal = wrapper.find('#testModal')
    //expect(modal.exists()).toBe(true)
  })
})


