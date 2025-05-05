import HomeView from '../pages/HomeView.vue';
import UseruserrStore from '../stores/userStore';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/loreg',
    name: 'Login',
    component: () => import('../pages/LoginView.vue'),
    beforeEnter: (to, from, next) => {
      const store = UseruserrStore();
      if (store.loggedIn) next({ name: 'Home' });
      else next();
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterView.vue'),
    beforeEnter: (to, from, next) => {
      const store = UseruserrStore();
      if (store.loggedIn) next({ name: 'Home' });
      else next();
    },
  },
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('../pages/VerificationView.vue'),
  },
  {
    path: '/verify/:userId/:token',
    name: 'Verify',
    component: () => import('../pages/VerificationView.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
];
