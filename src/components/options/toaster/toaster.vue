<template>
  <v-snackbar
    v-model="active"
    top
    color="pink accent-2"
    :timeout=2500
  >
    <v-icon
      icon
      small
    >fas fa-plus</v-icon>
    <div class="toast-text ml-2 mr-auto">
      <strong>{{ text }}</strong>
    </div>
  </v-snackbar>
</template>
<script>
export default {
  data: () => ({
    active: false,
  }),
  props: {
    text: {type: String, defualt: ""}
  },
  watch: {
    active: function (isActive, wasActive) {
      this.$emit('statusChange', isActive, wasActive)
    }
  },
  mounted() {
    this.$nextTick(() => this.show())
  },
  methods: {
    show() {
      this.active = true
    },
    close() {
      this.active = false
    }
  }
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