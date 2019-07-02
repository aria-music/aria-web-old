import Vue from 'vue'
import Router from 'vue-router'
import play from '@/components/container/play/play'
import search from '@/components/container/search/search'
import playlist from '@/components/container/playlist/playlist'
import playlistView from '@/components/container/playlist-view/playlist-view'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/play',
      component: play
    },
    {
      path: '/search',
      component: search
    },
    // {
    //   path: '/playlist',
    //   component: playlistView
    // },
    {
      path: '/',
      component: playlist
    }
  ]
})
