<script lang="ts">
// メニュー用のinterfaceを追加
export interface MenuItem {
  type: "heading" | "menu";
  title: string;
  icon?: string;
  url?: string;
}
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

// タイトルとメニューアイテムを設定できるようにする。
defineProps<{ title: string; menuItems: MenuItem[] }>();

const router = useRouter();
const isToggle = ref(false);

const goToUrl = (url?: string) => {
  if (url != undefined) {
    router.push(url);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};
</script>

<template>
    <!-- bodyは削除し、クラスをdivに移す -->
    <div :class="['sb-nav-fixed', isToggle ? 'sb-sidenav-toggled' : '']">
      <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <a class="navbar-brand ps-3" @click="isToggle = !isToggle">
           <img src="/logoWhite.svg" alt="白ロゴ" width="150" />
        </a>
        <button
          id="sidebarToggle"
          class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          @click="isToggle = !isToggle"
        >
          <i class="bi bi-list"></i>
        </button>
        <ul class="navbar-nav ms-auto me-3">
        <li class="nav-item">
          <a class="nav-link" href="#" @click.prevent="logout">
            <i class="bi bi-box-arrow-right me-1"></i> ログアウト
          </a>
        </li>
      </ul>
      </nav>
  
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav
            id="sidenavAccordion"
            class="sb-sidenav accordion sb-sidenav-dark"
          >
            <div class="sb-sidenav-menu">
              <!-- メニュー表示 -->
              <div v-for="(item, index) in menuItems" :key="index" class="nav">
                <div
                  v-if="item.type === 'heading'"
                  class="sb-sidenav-menu-heading"
                >
                  {{ item.title }}
                </div>
                <a
                  v-if="item.type === 'menu'"
                  class="nav-link"
                  @click="goToUrl(item.url)"
                >
                  <div class="sb-nav-link-icon">
                    <i :class="['bi', item.icon]"></i>
                  </div>
                  {{ item.title }}
                </a>
              </div>
            </div>
          </nav>
        </div>
  
        <div id="layoutSidenav_content">
          <main>
            <div class="container-fluid px-4">
              <router-view />
            </div>
          </main>
        </div>
      </div>
    </div>
  </template>
  