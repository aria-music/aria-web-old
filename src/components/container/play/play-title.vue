<template>
  <v-card class="pa-3" height="100%">
    <v-card
      max-height="350"
      max-width="350"
      class="mx-auto"
      :class="theme ? 'grey lighten-3' : 'grey darken-3'"
    >
      <v-img
        :src="nowPlaying.thumbnail == '' ? src : nowPlaying.thumbnail "
        contain
        class="img-size"
        :aspect-ratio="1/1"
      ></v-img>
    </v-card>
    <v-card
      class="mt-3 mx-auto width"
    >
      <v-card-title class="playing-title" v-if="showTitle">
          {{ nowPlaying.title }}
      </v-card-title>
      <v-card-title class="playing-title" v-else>
          {{ slicedTitle }}
      </v-card-title>
      <v-divider class="mx-3"></v-divider>
      <v-toolbar
          color="transparent"
          flat
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              v-for="item in items"
              :key="item.key"
              icon
              @click="btnFunc(item.key)"
              class="mr-0"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-card>
</template>
<script>
let slicetext = require('@/components/options/slicetext')

export default {
  data: () => ({
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    showTitle: false,
    items: [
      {key: 1, icon: "fab fa-facebook-f"},
      {key: 2, icon: "share"},
      {key: 3, icon: "error_outline"},
    ],
  }),
  props: {
    theme: {type: Boolean, required: true},
    nowPlaying: {type: Object, required: true},
  },
  computed: {
    slicedTitle() {
      return slicetext(this.nowPlaying.title, 37)
    },
  },
  methods: {
    btnFunc(key) {
      switch(key){
        case 1:
          break;
        case 2:
          break;
        case 3:
          this.showTitle = !this.showTitle
          break;
      }
    },
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
</style>