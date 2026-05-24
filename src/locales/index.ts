import type { App } from 'vue';

import {
  $t,
  registerLocaleMessages,
  setupI18n as coreSetup,
  type LocaleSetupOptions,
} from '@/vben/locales';

import dayjs from 'dayjs';
import defaultLocale from 'element-plus/es/locale/lang/zh-cn';

const elementLocale = defaultLocale;

type LocaleModule = {
  default: Record<string, unknown>;
};

const modules = import.meta.glob<LocaleModule>('./langs/zh-CN/**/*.json', {
  eager: true,
});

function flattenMessages(
  value: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  return Object.entries(value).reduce<Record<string, string>>(
    (accumulator, [key, nestedValue]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (
        nestedValue &&
        typeof nestedValue === 'object' &&
        !Array.isArray(nestedValue)
      ) {
        Object.assign(
          accumulator,
          flattenMessages(nestedValue as Record<string, unknown>, nextKey),
        );
        return accumulator;
      }
      accumulator[nextKey] = `${nestedValue ?? ''}`;
      return accumulator;
    },
    {},
  );
}

function registerAppLocales() {
  const messages: Record<string, string> = {};

  for (const [filePath, module] of Object.entries(modules)) {
    const matches = filePath.match(/\.\/langs\/zh-CN\/(.*)\.json$/);
    if (!matches) {
      continue;
    }

    const namespace = matches[1]?.replace(/\//g, '.') ?? '';
    Object.assign(messages, flattenMessages(module.default, namespace));
  }

  registerLocaleMessages(messages);
}

registerAppLocales();

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await import('dayjs/locale/zh-cn');
  dayjs.locale('zh-cn');
  return coreSetup(app, options);
}

export { $t, elementLocale, setupI18n };
