
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : DefaultLayout
})
console.log('🧭 現在のルート:', route.path);
</script>
<template>
  <!-- <RouterLink to="/" >Home</RouterLink> 
  <h1 class="display-5">ToDoリスト</h1> -->
  <div>
    <component :is="layoutComponent" />
  </div>

</template>
