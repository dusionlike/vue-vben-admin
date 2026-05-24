import type { Locale } from './messages';

import { ref } from 'vue';

import { createSharedComposable } from '@vueuse/core';

import { getMessages, registerSimpleLocaleMessages } from './messages';

type TranslateFn = ((key: string, params?: unknown[]) => string) & {
  value: (key: string, params?: unknown[]) => string;
};

function formatMessage(template: string, params: unknown[] = []) {
  return template.replace(/\{(\d+)\}/g, (_, index: string) => {
    return `${params[Number(index)] ?? ''}`;
  });
}

export const useSimpleLocale = createSharedComposable(() => {
  const currentLocale = ref<Locale>('zh-CN');

  const setSimpleLocale = (locale: Locale) => {
    currentLocale.value = locale;
  };

  const translate = (key: string, params: unknown[] = []) => {
    const localeMessages = getMessages(currentLocale.value);
    return formatMessage(localeMessages[key] || key, params);
  };

  const $t = Object.assign(translate, {
    value: translate,
  }) as TranslateFn;

  const $te = (key: string) => {
    return !!getMessages(currentLocale.value)[key];
  };

  return {
    $t,
    $te,
    currentLocale,
    registerSimpleLocaleMessages,
    setSimpleLocale,
  };
});

export { registerSimpleLocaleMessages };
export type { Locale };
