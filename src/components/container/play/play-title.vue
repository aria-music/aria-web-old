<template>
  <v-card class="pa-3" height="100%">
    <v-card
      max-height="350"
      max-width="350"
      class="mx-auto"
      :class="theme ? 'grey lighten-3' : 'grey darken-3'"
    >
      <v-img
        :src="nowPlaying.thumbnail "
        @error="swichToNoimage()"
        contain
        class="img-size"
        :aspect-ratio="1/1"
      ></v-img>
    </v-card>
    <v-card
      class="mt-3 mx-auto width"
    >
      <v-card-title class="playing-title" v-if="showTitle">
        <span v-if="nowPlaying.source == 'gpm'">{{ nowPlaying.entry.title }}</span>
        <span v-else>{{ nowPlaying.title }}</span>
      </v-card-title>
      <v-card-title class="playing-title" v-else>
        {{ slicedTitle }}
      </v-card-title>
      <v-card-text v-if="showTitle">
        <span v-if="nowPlaying.source == 'youtube'">
          <v-icon small>fab fa-youtube</v-icon>
        </span>
        <span v-if="nowPlaying.source == 'gpm'">
          <div>
            <v-icon small>fas fa-user-alt</v-icon>
            <span>{{ nowPlaying.entry.artist }}</span>
          </div>
          <div>
            <v-icon small>fas fa-compact-disc</v-icon>
            <span>{{ nowPlaying.entry.album }}</span>
          </div>
          <v-icon small>fab fa-google-play</v-icon>
        </span>
        <span v-if="nowPlaying.source == 'soundcloud'">
          <v-icon small>fab fa-soundcloud</v-icon>
        </span>
        <a :href="this.nowPlaying.uri" target="_blank" v-if="httpUri">{{ this.nowPlaying.uri }}</a>
        <span v-if="!httpUri">{{ this.nowPlaying.uri }}</span>
      </v-card-text>
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
    <playlistDialog
      :songUri="nowPlaying.uri"
      :dialog="showDialog"
    />
  </v-card>
</template>
<script>
import playlistDialog from "@/components/options/playlist_dialog/playlist-dialog"
const slicetext = require('@/components/options/slicetext')

export default {
  data: () => ({
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    showTitle: false,
    showDialog: false,
    items: [
      { key: 0, icon: "fab fa-facebook-f"},
      { key: 1, icon: "fab fa-twitter"},
      { key: 2, icon: "fab fa-itunes-note"},
      { key: 3, icon: "fas fa-plus"},
      { key: 4, icon: "error_outline"}
    ],
  }),
  components: {
    playlistDialog,
  },
  props: {
    theme: {type: Boolean, required: true},
    nowPlaying: {type: Object, required: true},
  },
  computed: {
    slicedTitle() {
      return this.nowPlaying.source == 'gpm' ? slicetext(this.nowPlaying.entry.title, 35) : slicetext(this.nowPlaying.title, 35)
    },
    httpUri() {
      if(this.nowPlaying.uri.indexOf('http')) return false
      else return true
    }
  },
  methods: {
    btnFunc(key) {
      switch(key){
        case 0:
          break
        case 1:
          this.postTwitter(this.nowPlaying)
          break
        case 2:
          this.$router.push('/piano')
          break
        case 3:
          this.showDialog = !this.showDialog
          break
        case 4:
          this.showTitle = !this.showTitle
          break
      }
    },
    postTwitter(now) {
      let twitterText = now.title + '\r\n'
      if(this.httpUri) twitterText = twitterText + now.uri + '\r\n'
      twitterText = twitterText + '#NowPlaying #AriaMusic'
      twitterText = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(twitterText)
      window.open(twitterText)
    },
    swichToNoimage() {
      this.nowPlaying.thumbnail = this.src
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