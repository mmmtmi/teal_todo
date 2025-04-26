import { createRouter,createWebHashHistory } from "vue-router";
import ListEdit from "./components/pages/ListEdit.vue";
import ListHome from "./components/pages/ListHome.vue";
import ListAdd from "./components/pages/ListAdd.vue";

const routes = [
    { path : "/",name:'ListHome' ,component: ListHome },
    { path : "/edit/:id",name:'ListEdit' ,component: ListEdit },
    { path : "/add",name:'ListAdd' ,component: ListAdd },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
