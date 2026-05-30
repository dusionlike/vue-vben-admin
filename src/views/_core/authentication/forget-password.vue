<script lang="ts" setup>
import type { VbenFormSchema } from '@/vben/common-ui';
import type { Recordable } from '@/vben/types';

import { computed, ref } from 'vue';

import { AuthenticationForgetPassword, z } from '@/vben/common-ui';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: '邮箱',
      rules: z
        .string()
        .min(1, { message: '请输入邮箱' })
        .email('你输入的邮箱格式不正确'),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  void value;
}
</script>

<template>
  <AuthenticationForgetPassword
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
