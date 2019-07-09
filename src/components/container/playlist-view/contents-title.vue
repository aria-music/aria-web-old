<template>
  <v-card class="pa-3" height="100%">
    <v-card
      max-height="350"
      max-width="350"
      class="mx-auto"
      :class="theme ? 'grey lighten-3' : 'grey darken-3'"
    >
      <v-img
        :src="thumbnail == '' ? '' : thumbnail"
        contain
        class="img-size"
        :aspect-ratio="1/1"
      ></v-img>
    </v-card>
    <v-card
      class="mt-3 mx-auto width"
    >
      <v-card-title class="playing-title">
          {{ title }}
      </v-card-title>
      <v-divider class="mx-3"></v-divider>
      <v-toolbar
          color="transparent"
          flat
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <transition-group class="my-auto" name="tandf">
            <v-btn
              flat
              key="play"
              @click="play"
              class="my-0 py-3"
            >
              <v-icon>play_arrow</v-icon>
              <div class="ml-1 pt-1">play all</div>
            </v-btn>
            <v-btn
              icon
              key="share"
              @click="torf = !torf"
              class="mr-0"
            >
              <v-icon>share</v-icon>
            </v-btn>
            <v-btn
              v-if="torf"
              icon
              key="twitter"
              class="mr-0"
            >
              <v-icon>fab fa-twitter</v-icon>
            </v-btn>
            <v-btn
              v-if="torf"
              icon
              key="facebook"
              class="mr-0"
            >
              <v-icon>fab fa-facebook-square</v-icon>
            </v-btn>
          </transition-group>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    torf: false,
  }),
  props: {
    theme: {type: Boolean, required: true},
    thumbnail: {type: String, required: true},
    title: {type: String, required: true},
  },
  methods: {
    play() {
      //
    }
  },
}
</script>
<style>
.width {
  min-width: 250px;
}
@media(min-width: 887px){
  .width{
    width: 350px;
  }
}
.playing-title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 1%;
}
.tandf-enter-active {
  transition: .5s ease-in;
}
.tandf-leave-active {
  transition: .1s ease-in;
}
.tandf-enter, .tandf-leave-to {
  opacity: 0;
}
.tandf-leave, .tandf-enter-to {
  opacity: 1;
}
</style>