<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { googleSdkLoaded } from 'vue3-google-login';

import userUserStore from '@/stores/userStore.js';
// import { Icon } from '@iconify/vue';

const router = useRouter();
const store = userUserStore();

const user = ref({
  firstName: 'Efe',
  lastName: 'Sert',
  email: 'sert.e19@htlwienwest.at',
  password: '123456789',
  confirmPassword: '123456789',
});

const register = async (newUser) => {
  const result = await store.register(newUser);

  if (result && result.verificationToken) {
    router.push(`/verify/${result.userId}/${result.verificationToken}`);
  } else {
    window.scrollTo(0, 300);
  }
};

const login = (newUser) => {
  const result = store.login(newUser);

  result.then((res) => {
    if (res === 'success') {
      router.push('/');
    } else window.scrollTo(0, 300);
  });
};

const $q = useQuasar();
const authStore = useAuthStore();
const userDetails = ref(null);

const client_id = import.meta.env.VITE_APP_CLIENT_ID;

const getAuthorizationCode = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id,
        scope: 'email profile openid',
        callback(response) {
          sendCodeToBackend(response.code);
        },
      })
      .requestCode();
  });
};

const sendCodeToBackend = async (code) => {
  try {
    const { data } = await axios.post(
      'http://localhost:3000/auth/oauth2callback',
      { code },
      { withCredentials: true }, // <-- Wichtig, damit Session-Cookie gespeichert wird
    );
    authStore.setUserDetails(data);
    userDetails.value = data;
    router.push('/');
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error.response?.data?.error || 'Login failed. Please try again.',
    });
  }
};

const tab = ref('login');

// login
const username = ref('');
const password = ref('');

// register
const firstName = ref('');
const lastName = ref('');
const EMail = ref('');
const regPassword = ref('');
const regPasswordRepeat = ref('');
</script>

<template>
  <div class="row justify-center items-center">
    <!-- Linke Spalte: Logo (nur Desktop sichtbar) -->
    <div v-if="$q.screen.gt.sm" class="col column justify-center items-center">
      <q-img src="/svg/logo.svg" style="width: 250px" />
    </div>

    <!-- Rechte Spalte: Login/Register -->
    <div class="col bg-dark q-pa-xl justify-center items-center column text-white form-container">
      <div class="form-content">
        <q-tabs v-model="tab" class="full-width">
          <q-tab name="login" label="Login"></q-tab>
          <q-tab name="register" label="Register"></q-tab>
        </q-tabs>

        <!-- Login -->
        <div v-if="tab == 'login'">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md q-ma-sm"
            @submit.prevent="login(user)"
          >
            <q-input
              dark
              filled
              type="email"
              v-model="user.email"
              rounded
              id="email-address"
              label="Your Email *"
              placeholder="z.B. sert.e19@htlwienwest.at"
              lazy-rules
            />
            <q-input
              dark
              filled
              rounded
              type="password"
              id="passwort"
              v-model="user.password"
              placeholder="z.B. p4$$w027"
              label="Your Password *"
              lazy-rules
            />

            <div class="row q-gutter-sm justify-center">
              <q-btn label="Submit" type="submit" color="primary" class="full-height" />
              <q-btn label="Reset" type="reset" color="primary" flat class="full-height" />
            </div>
            <div
              class="rounded-[30px] bg-secondary p-6 text-left text-red-500"
              v-if="store.showErros"
            >
              <ul>
                <li class="flex space-x-5" v-for="error of store.errors" :key="error">
                  <Icon class="ml-2 mt-1 h-full w-6" icon="material-symbols:error-rounded"></Icon
                  ><span class="mt-1">
                    {{ error.msg }}
                  </span>
                </li>
              </ul>
            </div>

            <div class="line-separator">
              <div class="line"></div>
              <span class="separator-text">OR</span>
              <div class="line"></div>
            </div>
          </q-form>
        </div>

        <!-- Register -->
        <div v-if="tab == 'register'">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md q-ma-sm"
            @submit.prevent="register(user)"
          >
            <div class="row q-gutter-sm">
              <q-input
                dark
                filled
                v-model="user.firstName"
                rounded
                label="Your Firstname *"
                lazy-rules
                placeholder="z.B. Efe"
                class="col"
              />
              <q-input
                dark
                filled
                v-model="user.lastName"
                rounded
                label="Your Lastname *"
                lazy-rules
                placeholder="z.B. Sert"
                class="col"
              />
            </div>
            <q-input
              dark
              filled
              rounded
              label="Your E-Mail *"
              lazy-rules
              placeholder="z.B. sert.e19@htlwienwest.at"
              v-model="user.email"
            />
            <q-input
              dark
              filled
              rounded
              type="password"
              v-model="user.password"
              label="Your Password *"
              placeholder="z.B. 123456789"
              id="passwort"
              name="passwort"
              lazy-rules
            />
            <q-input
              dark
              filled
              rounded
              type="password"
              v-model="user.confirmPassword"
              label="Repeat your Password *"
              id="confirmPassword"
              placeholder="z.B. 123456789"
              lazy-rules
            />

            <div class="row q-gutter-sm justify-center">
              <q-btn label="Submit" type="submit" color="primary" class="full-height" />
              <q-btn label="Reset" type="reset" color="primary" flat class="full-height" />
            </div>
            <div
              class="mx-4 rounded-[30px] bg-secondary p-6 text-left text-red-500"
              v-if="store.showErros"
            >
              <ul>
                <li class="flex space-x-5" v-for="error of store.errors" :key="error">
                  <Icon class="ml-2 mt-1 h-full w-6" icon="material-symbols:error-rounded"></Icon
                  ><span class="mt-1">
                    {{ error.msg }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="line-separator">
              <div class="line"></div>
              <span class="separator-text">OR</span>
              <div class="line"></div>
            </div>
          </q-form>
        </div>

        <!-- Google Login -->
        <q-btn
          @click="getAuthorizationCode"
          class="q-mb-md google-btn"
          label="Login with Google"
          color="white"
          outline
          icon="fab fa-google"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  height: calc(100vh - 126px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-content {
  width: 100%;
  max-width: 400px; /* 🔥 Maximale Breite */
}

.full-height {
  height: 42px;
}

.google-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  width: 100%;
}

.line-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}

.line {
  flex-grow: 1;
  height: 1px;
  background-color: #d3d3d3;
}

.separator-text {
  margin: 0 1rem;
  font-weight: bold;
  color: #d3d3d3;
}
</style>
