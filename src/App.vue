<template>
  <v-app :dark="theme" v-resize="setWidth">
    <ariaHeader
      :width="width"
    />
    <div class="mt-5 pt-3 mx-auto" :style="{width: `${width}px`}">
      <router-link to="/playing"></router-link>
      <router-link to="/searched"></router-link>
      <router-link to="/playlist"></router-link>
      <router-link to="/piano"></router-link>
      <router-link to="/"></router-link>
      <transition name="aria" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <ariaFooter
     :width="width"
    />
  </v-app>
</template>

<script>
import ariaHeader from '@/components/header/aria-header'
import ariaFooter from '@/components/footer/aria-footer'

// register close confirmation
window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  e.returnValue = 'Sure want to leave?'
})

export default {
  name: 'app',
  components: {
    ariaHeader,
    ariaFooter,
  },
  data: () => ({
    width: 0,
  }),
  mounted() {
    this.setWidth()
  },
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
  methods: {
    setWidth() {
      const windowWidth = window.innerWidth
      this.width = windowWidth > 1200 ? 1200 : windowWidth
    }
  },
}
</script>
<style>
::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
}
.aria-enter-active, .aria-leave-active {
  transition: opacity .3s ease;
}
.aria-enter, .aria-leave-to {
  opacity: 0;
}
</style>
