<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')
</script>

<template>
  <!-- <RouterLink to="/" >Home</RouterLink> 
  <h1 class="display-5">ToDoリスト</h1> -->
  <div>
    <DefaultLayout v-if="layout === 'default'" />
    <AuthLayout v-else/>
  </div>
  
  
 

</template>
