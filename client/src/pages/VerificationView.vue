<template>
  <div class="flex flex-col items-center justify-center space-y-6">
    <img class="w-40" src="@/assets/images/confirm-email-icon.svg" alt="" />
    <span>{{ store.msg }}</span>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import userUserStore from '@/stores/userStore.js';

const store = userUserStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const { userId, token } = route.params;
  const res = await store.verify(userId, token);

  if (res === 'success') {
    router.push('/'); // Weiterleitung nach erfolgreicher Verifikation
  }
});
</script>

<style lang="scss" scoped></style>
