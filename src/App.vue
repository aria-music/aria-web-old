<template>
  <v-app :dark="theme">
    <ariaHeader/>
    <div class="py-4 mb-3"></div>
    <router-link to="/playing"></router-link>
    <router-link to="/searched"></router-link>
    <!-- <router-link to="/playlist"></router-link> -->
    <router-link to="/"></router-link>
    <router-view></router-view>
    <ariaFooter/>
  </v-app>
</template>

<script>
import ariaHeader from '@/components/header/aria-header'
import ariaFooter from '@/components/footer/aria-footer'

export default {
  name: 'app',
  components: {
    ariaHeader,
    ariaFooter,
  },
  data: () => ({
    //
  }),
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
  methods: {
    //
  },
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
}
</style>
