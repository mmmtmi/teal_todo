import { createRouter,createWebHashHistory, createWebHistory  } from "vue-router";
import ListEdit from "./components/pages/ListEdit.vue";
import ListHome from "./components/pages/ListHome.vue";
import ListAdd from "./components/pages/ListAdd.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import RegisterUser from "./components/pages/RegisterUser.vue";

const routes = [
    { path : "/home", name: 'ListHome', component: ListHome, meta: { layout: 'default', requiresAuth: true }},
    { path : "/edit/:id", name: 'ListEdit', component: ListEdit, meta: { layout: 'default', requiresAuth: true }},
    { path : "/add", name: 'ListAdd', component: ListAdd, meta: { layout: 'default', requiresAuth: true }},
    { path : "/", name: 'LoginPage', component: LoginPage, meta: { layout: 'auth' }},
    { path : "/register", name: 'Register', component: RegisterUser, meta: { layout: 'auth' }},
  ];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    if (to.meta.requiresAuth && !token) {
      // 未ログインで認証が必要なページ → ログインページに飛ばす
      next({ path: "/" });
    } else if ((to.path === "/" || to.path === "/register") && token) {
      // ログイン済みの人がログインページか新規登録ページに行こうとしたら /home にリダイレクト
      next({ path: "/home" });
    } else {
      next();
    }
  });

export default router;
