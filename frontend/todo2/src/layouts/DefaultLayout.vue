<script setup lang="ts">
import AppNavi, { type MenuItem } from "../components/pages/AppNavi.vue";
const menuItems: MenuItem[] = [
  {
    type: "heading",
    title: "Main",
  },
  {
    type: "menu",
    title: "ToDo一覧",
    icon: "bi-list",
    url: "/home",
  },
  {
    type: "menu",
    title: "ToDoの追加",
    icon: "bi-list",
    url: "/add",
  },
];
</script>


<template>
  <div>
    <AppNavi title="Todo App" :menu-items="menuItems" />
    <div class="container-fluid px-4 mt-4">
      
    </div>
  </div>
</template>
  