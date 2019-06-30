<template>
  <v-app :dark="theme">
    <ariaHeader/>
    <router-link to="/playing">playing</router-link>
    <router-link to="/searched">searched</router-link>
    <router-link to="/">playlist</router-link>
    <router-view/>
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
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
}
</style>
