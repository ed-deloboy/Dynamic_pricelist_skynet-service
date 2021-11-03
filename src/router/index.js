import Vue from 'vue'
import VueRouter from 'vue-router'

const GeneralInformation= () => import('@/components/Pages/GeneralInformation.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'GeneralInformation',
    component: GeneralInformation
  },
]

const router = new VueRouter({
  routes
})

export default router
