import { mount } from '@vue/test-utils';

import { describe, expect, it } from 'vitest';

import About from '../about.vue';

describe('about.vue', () => {
  it('renders fallback content when metadata is not injected', () => {
    const globalWithMetadata = globalThis as typeof globalThis & {
      __VBEN_ADMIN_METADATA__?: unknown;
    };
    const hadMetadata = Object.prototype.hasOwnProperty.call(
      globalWithMetadata,
      '__VBEN_ADMIN_METADATA__',
    );
    const previousMetadata = globalWithMetadata.__VBEN_ADMIN_METADATA__;

    try {
      delete globalWithMetadata.__VBEN_ADMIN_METADATA__;

      const wrapper = mount(About);

      expect(wrapper.text()).toContain('基本信息');
      expect(wrapper.text()).toContain('版本号');
      expect(wrapper.text()).toContain('-');
    } finally {
      if (hadMetadata) {
        globalWithMetadata.__VBEN_ADMIN_METADATA__ = previousMetadata;
      }
    }
  });
});
