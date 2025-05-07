
import { createRouter,createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from ,next) => {
    const isAuthenticated = !! localStorage.getItem('token');
    if (to.meta.requirezauth && !isAuthenticated){
        next('/');
    }else{
        next();
    }
});

export default router;