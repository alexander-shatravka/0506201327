import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/components/Profile'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: ('/profiles/1')
    },
    {
      path: '/profiles/:profileId',
      name: 'profile',
      component: Profile
    }
  ]
})
