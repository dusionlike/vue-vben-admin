import type { App } from 'vue';

import type { LocaleSetupOptions, SupportedLanguagesType } from './typing';

import { ref } from 'vue';

type LocaleModule = {
  default: Record<string, unknown>;
};

type LocaleMessages = Record<string, string>;

type TranslateFn = ((key: string, params?: unknown[]) => string) & {
  value: (key: string, params?: unknown[]) => string;
};

const DEFAULT_LOCALE: SupportedLanguagesType = 'zh-CN';

const coreModules = import.meta.glob<LocaleModule>('./langs/zh-CN/**/*.json', {
  eager: true,
});

const locale = ref<SupportedLanguagesType>(DEFAULT_LOCALE);
const localeMessages: LocaleMessages = {};

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

function collectLocaleMessages(
  modules: Record<string, LocaleModule>,
): LocaleMessages {
  const messages: LocaleMessages = {};

  for (const [filePath, module] of Object.entries(modules)) {
    const matches = filePath.match(/\.\/langs\/zh-CN\/(.*)\.json$/);
    if (!matches) {
      continue;
    }

    const namespace = matches[1]?.replace(/\//g, '.') ?? '';
    Object.assign(messages, flattenMessages(module.default, namespace));
  }

  return messages;
}

function formatMessage(template: string, params: unknown[] = []) {
  return template.replace(/\{(\d+)\}/g, (_, index: string) => {
    return `${params[Number(index)] ?? ''}`;
  });
}

function registerLocaleMessages(messages: LocaleMessages) {
  Object.assign(localeMessages, messages);
}

registerLocaleMessages(collectLocaleMessages(coreModules));

const translate = (key: string, params: unknown[] = []) => {
  return formatMessage(localeMessages[key] || key, params);
};

const $t = Object.assign(translate, {
  value: translate,
}) as TranslateFn;

const $te = (key: string) => {
  return !!localeMessages[key];
};

const i18n = {
  global: {
    locale,
    t: $t,
    te: $te,
  },
} as const;

async function setupI18n(_app: App, _options: LocaleSetupOptions = {}) {
  locale.value = DEFAULT_LOCALE;
}

export {
  $t,
  $te,
  i18n,
  registerLocaleMessages,
  setupI18n,
};
export type { LocaleSetupOptions, SupportedLanguagesType };
export type { SupportedLanguagesType as Locale };
