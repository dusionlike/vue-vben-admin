import type { RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: "演示",
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: "Element Plus",
        },
        name: 'NaiveDemos',
        path: '/demos/element',
        component: () => import('@/views/demos/element/index.vue'),
      },
      {
        meta: {
          title: "表单演示",
        },
        name: 'BasicForm',
        path: '/demos/form',
        component: () => import('@/views/demos/form/basic.vue'),
      },
    ],
  },
];

export default routes;
