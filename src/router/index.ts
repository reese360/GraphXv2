import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // {
  // 	path: '/',
  // 	name: 'Home',
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
