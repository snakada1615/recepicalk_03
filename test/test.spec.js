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

    button.trigger('click');

    await wrapper.vm.$nextTick()
    expect(modal.exists()).toBe(true)

  })
})


