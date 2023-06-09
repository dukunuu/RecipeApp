import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/routes/index'
import store from '@/store/index'
import { getAuth, onAuthStateChanged } from "firebase/auth";
let app;
const auth = getAuth();
    onAuthStateChanged(auth, () => {
      if (!app) {
        createApp(App).use(router).use(store).mount('#app')
      } 
});

