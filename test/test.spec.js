import { mount, createWrapper, createLocalVue } from '@vue/test-utils';
import test from '@/components/test.vue';
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('test.vue', () => {
  it('$root.$emitの検証', () => {
    const wrapper = mount(test, {localVue});


  });
});
