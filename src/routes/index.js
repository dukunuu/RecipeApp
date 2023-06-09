import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/Search.vue"),
  },
  {
    path: "/myrecipes",
    name: "MyRecipes",
    component: () => import("@/views/MyRecipe.vue"),
  },

  {
    path: "/editrecipe",
    name: "EditRecipe",
    component: () => import("@/views/EditRecipe.vue"),
  },
  {
    path:"/resetPassword",
    name:"ResetPassword",
    component:()=>import("../views/ResetPassword.vue")
  },
  {
    path:"/profile",
    name:"Profile",
    component:()=>import("../views/Profile.vue")
  },
  {
    path:"/createRecipe",
    name:"CreateRecipe",
    component:()=>import("../views/CreateRecipe.vue")
  }
];
const router=createRouter({
    routes,
    history: createWebHistory(),
})

export default router;