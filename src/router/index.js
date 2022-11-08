import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/LoginView.vue'
import axios from 'axios'
import ChatView from '../views/chatView.vue'
import registerView from '../views/registerView'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView
  },
  {
    path: '/register',
    name: 'register',
    component: registerView
  }
  
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
});

router.beforeEach((req, res, next) => {
  if(req.path === '/') {
    return next({ name: 'login'});
  }
  if (!localStorage.getItem("accessToken")) {
    if (req.path === '/login') {
      return next()
    }
    return next({ name: 'login' })
  }

  axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("accessToken");

  next()
})

export default router;
