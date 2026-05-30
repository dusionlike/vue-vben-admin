<script lang="ts" setup>
import { useElementPlusDesignTokens } from '@/vben/hooks';

import { ElConfigProvider } from 'element-plus';
import zhCnLocale from 'element-plus/es/locale/lang/zh-cn';

defineOptions({ name: 'App' });

useElementPlusDesignTokens();
</script>

<template>
  <ElConfigProvider :locale="zhCnLocale">
    <RouterView />
  </ElConfigProvider>
</template>
