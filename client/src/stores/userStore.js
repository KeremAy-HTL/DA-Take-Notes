import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { EncryptStorage } from 'encrypt-storage';

const encryptData = new EncryptStorage('TakeNotes-Encrypt-Key');

const userUserStore = defineStore('TakeNotesUser', () => {
  const user = ref({});
  const msg = ref('');
  const errors = ref([]);
  const showErros = ref(false);
  const loggedIn = ref(false);

  const saveData = () => {
    const store = userUserStore();
    localStorage.setItem(store.$id, encryptData.encryptString(JSON.stringify(store.$state)));
  };

  const register = async (newUser) => {
    errors.value = [];

    try {
      const { data } = await axios.post('/user-api/auth/user/signup', newUser);
      msg.value = data.message;
      showErros.value = false;
      return { userId: data.userId, verificationToken: data.verificationToken };
    } catch (error) {
      showErros.value = true;
      errors.value = error.response.data.errors;
    }
  };

  const login = async (newUser) => {
    errors.value = [];
    try {
      const { data } = await axios.post('/user-api/auth/user/signin', newUser);
      user.value = data.user;
      showErros.value = true;
      loggedIn.value = true;
      saveData();
      return 'success';
    } catch (error) {
      showErros.value = true;
      errors.value = error.response.data.errors;
      if (error.response.data.message) {
        errors.value = [{ msg: error.response.data.message }];
      }
    }
  };

  // const verify = async (userId, token) => {
  //   try {
  //     const { data } = await axios.get(`/user-api/auth/user/verify/${userId}/${token}`);
  //     msg.value = data.message;
  //     return 'success';
  //   } catch (error) {
  //     showErros.value = true;
  //     errors.value = error.response.data.errors;
  //     if (error.response.data.message) {
  //       errors.value = [{ msg: error.response.data.message }];
  //     }
  //     return 'error';
  //   }
  // };

  const logout = async () => {
    await axios.post('/user-api/user/signout');
    user.value = {};
    loggedIn.value = false;
    localStorage.removeItem('TakeNotesUser');
  };
  const delAccount = async () => {
    await axios.delete(`/user-api/user/delaccount/${user.value.user_id}`);
    user.value = {};
    loggedIn.value = false;
    localStorage.removeItem('TakeNotesUser');
  };

  const fillStore = () => {
    if (localStorage.getItem('TakeNotesUser')) {
      const datenEntschluesselt = JSON.parse(
        encryptData.decryptString(localStorage.getItem('TakeNotesUser')),
      );
      const store = userUserStore();
      store.$state = datenEntschluesselt;
    }
  };

  return {
    user,
    login,
    register,
    msg,
    errors,
    showErros,
    loggedIn,
    logout,
    delAccount,
    fillStore,
  };
});

export default userUserStore;
