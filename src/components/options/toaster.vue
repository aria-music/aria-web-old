<template>
  <v-snackbar
    v-model="active"
    right
    top
    color="pink accent-2"
    :timeout=9000
    class="toast"
  >
    <v-icon
      icon
      small
    >fas fa-plus</v-icon>
    <div class="toast-text ml-2 mr-auto">
      <strong>add  {{ text }}</strong>
    </div>
  </v-snackbar>
</template>
<script>
export default {
  data: () => ({
    active: false,
  }),
  props: {
    text: {type: String, defualt: null}
  },
  watch: {
    text: function(newText) {
      if(newText != null) this.showToast()
    }
  },
  mounted() {
    this.$nextTick(() => this.showToast())
  },
  methods: {
    showToast() {
      this.active = true
    },
    closeToast() {
      this.active = false
    }
  },
}
</script>
<style>
.toast-text + .toast-icon{
  margin: 0 !important;
  position: absolute;
  transform: scale(0.75);
  padding: 4px !important;
}
</style>