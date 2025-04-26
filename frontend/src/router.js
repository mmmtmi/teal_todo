import { createRouter, createWebHistory } from "vue-router";
import MyHome from "./MyHome.vue";
import MyEdit from "./MyEdit.vue";

const routes = [
    {path : '/', name: 'home', component: MyHome},
    {path : '/edit/:id', name: 'MyEdit', component: MyEdit}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;