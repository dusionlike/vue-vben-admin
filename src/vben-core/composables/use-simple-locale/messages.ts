export type Locale = 'en-US' | 'zh-CN';

const localeMessages: Record<Locale, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    prompt: 'Prompt',
    reset: 'Reset',
    submit: 'Submit',
  },
  'zh-CN': {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    prompt: '提示',
    reset: '重置',
    submit: '提交',
  },
};

function getMessages(locale: Locale) {
  return localeMessages[locale];
}

function registerSimpleLocaleMessages(
  messages: Partial<Record<Locale, Record<string, string>>>,
) {
  for (const [locale, entries] of Object.entries(messages)) {
    if (!entries) {
      continue;
    }

    const currentLocaleMessages =
      localeMessages[locale as Locale] ?? (localeMessages[locale as Locale] = {});
    Object.assign(currentLocaleMessages, entries);
  }
}

export { getMessages, registerSimpleLocaleMessages };
