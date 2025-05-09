<script setup lang="ts">
import AppNavi, { type MenuItem } from "../components/pages/AppNavi.vue";
const menuItems: MenuItem[] = [
  {
    type: "heading",
    title: "Main",
  },
  {
    type: "menu",
    title: "ToDo",
    icon: "bi-list",
    url: "/home",
  },
  {
    type: "menu",
    title: "ToDo/add",
    icon: "bi-list",
    url: "/add",
  },
];
</script>


<template>
    <div>
        <AppNavi title="Todo App" :menu-items="menuItems"/>
        <router-view />
    </div>
  </template>
  