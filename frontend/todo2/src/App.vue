<script setup lang="ts">
import AppNavi, { type MenuItem } from "./components/pages/AppNavi.vue";

const menuItems: MenuItem[] = [
  {
    type: "heading",
    title: "Main",
  },
  {
    type: "menu",
    title: "ToDo",
    icon: "fa-list",
    url: "/",
  },
  {
    type: "menu",
    title: "ToDo/add",
    icon: "fa-list",
    url: "/add",
  },
];

</script>

<template>
  <!-- <RouterLink to="/" >Home</RouterLink> 
  <h1 class="display-5">ToDoリスト</h1> -->
  <AppNavi title="Todo App" :menu-items="menuItems"></AppNavi>
  
 

</template>
