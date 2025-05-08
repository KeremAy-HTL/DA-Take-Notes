<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import userUserStore from '@/stores/userStore.js';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();

import axios from 'axios';

const router = useRouter();

const authStore = useAuthStore();
const drawer = ref(false);

const store = userUserStore();

const menuItems = [
  { to: '/video', label: 'Video', icon: 'description' },
  { to: '/pdf', label: 'PDF', icon: 'picture_as_pdf' },
  { to: '/groups', label: 'Groups', icon: 'groups' },
  { to: '/powerpoint', label: 'Powerpoint', icon: 'powerpoint' },
];

const logout = async () => {
  try {
    await axios.get('/auth/logout');
    authStore.clearUserDetails();
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
const delAccount = () => {
  store.delAccount(store.user.id);
  store.logout();
  router.push('/');
};
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="row justify-between q-pt-md text-white" style="margin: 0 5vw 0 3vw">
    <!-- New Desktop Navbar -->
    <div class="mb-12 mt-4 hidden grid-cols-3 justify-center rounded-full px-10 py-6 sm:grid">
      <RouterLink class="flex items-center" to="/"></RouterLink>
      <nav class="flex items-center justify-center text-xl">
        <RouterLink
          to="/"
          class="mr-5 rounded-xl px-5 underline-offset-8"
          :class="route.fullPath == '/' ? 'font-plutoBd text-blue' : ''"
          >Home
        </RouterLink>
      </nav>
      <RouterLink class="flex justify-end" to="/loreg" v-if="!store.loggedIn">
        <button class="rounded-full bg-blue px-10 py-2 text-white">Anmelden</button>
      </RouterLink>
      <div class="flex justify-end" v-if="store.loggedIn">
        <ProfileComp />
      </div>
    </div>
    <div class="row items-center space">
      <!-- Desktop: Logo + Tabs -->
      <template v-if="!$q.screen.lt.md">
        <router-link to="/" class="row items-center no-link">
          <q-img
            src="/svg/logo.svg"
            height="100%"
            width="80px"
            style="position: relative; filter: invert(1)"
          ></q-img>
        </router-link>
        <q-separator class="q-ma-md bold bg-white q-pt-xl" style="height: 30px" vertical />
        <q-tabs>
          <q-route-tab style="font-size: large" to="/video">Video</q-route-tab>
          <q-route-tab style="font-size: large" to="/pdf">PDF</q-route-tab>
          <q-route-tab style="font-size: large" to="/powerpoint">PowerPoint</q-route-tab>
          <q-route-tab style="font-size: large" to="/groups">Groups</q-route-tab>
        </q-tabs>
      </template>

      <!-- Mobile: Burger-Menü -->
      <template v-else>
        <div class="row items-center justify-between full-width">
          <!-- Burger Menü Button -->
          <q-btn dense flat round icon="menu" @click="drawer = !drawer" class="q-ml-sm" />

          <!-- Logo schön zentriert -->
          <div class="absolute-center">
            <router-link to="/" class="no-link">
              <q-img src="/svg/logo.svg" style="filter: invert(1)" width="80px" />
            </router-link>
          </div>
        </div>

        <q-drawer
          v-model="drawer"
          side="left"
          overlay
          :width="250"
          :breakpoint="768"
          class="bg-primary text-white shadow-2"
        >
          <q-scroll-area class="fit q-mt-xl">
            <q-list padding>
              <q-item-label header class="text-h3 text-white q-ml-sm q-mb-md first">
                Menü
              </q-item-label>

              <router-link v-for="item in menuItems" :key="item.to" :to="item.to" class="no-link">
                <q-item clickable v-ripple @click="drawer = false" class="q-py-md">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" size="28px" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </router-link>
            </q-list>
          </q-scroll-area>
        </q-drawer>
      </template>
    </div>
    <!-- New Mobile Navbar -->
    <div class="fixed-top navbar flex sm:hidden">
      <nav
        class="dark:bg-gray-900 border-gray-200 dark:border-gray-600 left-0 top-0 z-20 w-full border-b bg-white"
      >
        <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <RouterLink class="flex items-center" to="/"></RouterLink>
          <div class="flex md:order-2">
            <button
              @click="toggleMenu"
              data-collapse-toggle="navbar-sticky"
              type="button"
              class="text-gray-500 hover:bg-gray-100 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 inline-flex items-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <i class="fa-solid fa-user-secret"></i>
            </button>
          </div>
          <div
            class="w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-sticky"
            :class="{ hidden: !isMenuOpen }"
          >
            <ul
              class="border-gray-100 bg-gray-50 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 mt-4 flex flex-col items-center space-y-3 rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0"
            >
              <li>
                <RouterLink
                  @click="toggleMenu"
                  to="/"
                  class="rounded-xl px-5 underline-offset-8 focus:font-plutoBd focus:text-blue q-pr-lg"
                  :class="route.fullPath == '/' ? 'font-plutoBd text-blue' : ''"
                  >Home
                </RouterLink>
              </li>
              <div class="my-4 w-full border-b-[1px]"></div>
              <li>
                <RouterLink
                  class="flex justify-center"
                  to="/loreg"
                  v-if="!store.loggedIn"
                  @click="toggleMenu"
                >
                  <button class="rounded-full bg-blue px-10 py-2 text-white">Anmelden</button>
                </RouterLink>
                <div class="flex flex-wrap justify-center space-y-3" v-if="store.loggedIn">
                  <button class="px-10 text-dark hover:ring-2 hover:ring-blue" @click="logout()">
                    Abmelden
                  </button>
                  <button
                    class="px-10 text-dark hover:ring-2 hover:ring-blue"
                    @click="delAccount()"
                  >
                    Account löschen
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <!-- Login / Logout Button -->
    <div>
      <router-link v-if="!authStore.userDetails" to="/loreg">
        <q-btn
          icon="fa-solid fa-user"
          outline
          rounded
          size="md"
          class="q-my-lg q-ml-md q-pa-md text-white"
          ><span class="q-ml-sm gt-md">Anmelden</span></q-btn
        >
      </router-link>
      <q-btn
        v-else
        @click="logout"
        icon="fa-solid fa-sign-out-alt"
        outline
        rounded
        size="md"
        class="q-my-lg q-ml-md q-pa-md text-white"
      >
        <span class="q-ml-sm gt-sm lt-xs">Logout</span>
      </q-btn>
    </div>
  </header>
</template>

<style scoped>
.no-link {
  text-decoration: none;
  color: inherit;
}
</style>
