<template>
  <Header :nav-items="NAV_ITEMS" />
  <router-view />
  <Toast />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Toast from '@/components/Admin/Toast.vue';
import { NAV_ITEMS } from '@/constants';
</script>
