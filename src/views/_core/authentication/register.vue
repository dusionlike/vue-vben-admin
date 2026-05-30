<script lang="ts" setup>
import type { VbenFormSchema } from '@/vben/common-ui';
import type { Recordable } from '@/vben/types';

import { computed, h, ref } from 'vue';

import { AuthenticationRegister, z } from '@/vben/common-ui';

defineOptions({ name: 'Register' });

const loading = ref(false);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入用户名',
      },
      fieldName: 'username',
      label: '账号',
      rules: z.string().min(1, { message: '请输入用户名' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '密码',
      },
      fieldName: 'password',
      label: '密码',
      renderComponentContent() {
        return {
          strengthText: () => '使用 8 个或更多字符，混合字母、数字和符号',
        };
      },
      rules: z.string().min(1, { message: '请输入密码' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '确认密码',
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: '请输入密码' })
            .min(1, { message: '请输入密码' })
            .refine((value) => value === password, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: '确认密码',
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            '我同意',
            h(
              'a',
              {
                class: 'vben-link ml-1 ',
                href: '',
              },
              `${'隐私政策'} & ${'条款'}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: '请同意隐私政策和条款',
      }),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  void value;
}
</script>

<template>
  <AuthenticationRegister
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
