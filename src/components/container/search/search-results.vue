<template>
  <v-card>
    <v-container>
      <perfect-scrollbar id="search-result">
        <transition-group name="searched-list">
          <v-card
            class="searchResults"
            v-for="result in showList"
            :key="result.key"
            height="100"
            width="95%"
            flat
          >
            <v-layout row wrap align-center>
              <v-flex xs2 @click="playMusic(result)">
                <v-img
                  class="mx-auto"
                  :src="result.thumbnail == '' ? src : result.thumbnail "
                  contain
                  max-height="80"
                  max-width="80"
                  :aspect-ratio="1/1"
                ></v-img>
              </v-flex>
              <v-flex xs9 @click="playMusic(result)">
                <v-layout column>
                  <v-flex>
                    <v-card-title class="pl-1 py-0">
                      <strong>{{ result.source == 'youtube' ? (result.title.length > 37 ? result.title.slice(0, 37)+'...' : result.title) : result.entry.title}}</strong>
                    </v-card-title>
                  </v-flex>
                  <v-flex>
                    <v-divider class="mr-3"></v-divider>
                  </v-flex>
                  <v-flex>
                    <v-layout row>
                      <v-flex xs1 mt-1>
                        <v-icon>{{ result.source == 'youtube' ? 'fab fa-youtube' : 'fab fa-google-play' }}</v-icon>
                      </v-flex>
                      <v-flex v-if="result.source == 'gpm'">
                        <v-card-text class="pt-2 pl-0">
                          <v-icon small class="mr-1">fas fa-music</v-icon>
                          <strong>{{ result.entry.artist }}</strong>
                          <v-icon small class="ml-3  mr-1">fas fa-compact-disc</v-icon>
                          <strong>{{ result.entry.album }}</strong>
                        </v-card-text>
                      </v-flex>
                      <v-spacer></v-spacer>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <!-- <v-btn
                  class="ma-0"
                  icon
                  flat
                  @click="result.isFavorite = !result.isFavorite"
                  :color="result.isFavorite ? 'pink lighten-3' : ''"
                  ><v-icon v-if="result.isFavorite" color="pink darken-1">favorite</v-icon>
                  <v-icon v-else>favorite_border</v-icon>
                </v-btn> -->
                <v-menu
                  bottom
                  origin="center center"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="ma-0"
                      icon
                      flat
                      v-on="on"
                    >
                      <v-icon small>fas fa-ellipsis-v</v-icon>
                    </v-btn>
                  </template>
                  <v-list
                    class="py-0"
                  >
                    <v-list-tile
                      v-for="item in items"
                      :key="item.key"
                      class="queue-sub-menu"
                      @click="subSelectMenu(item.key, result)"
                    >
                      <v-list-tile-title>
                        <div style="font-size: 14px">{{ item.content }}</div>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-card>
        </transition-group>
      </perfect-scrollbar>
    </v-container>
  </v-card>
</template>
<script>
const slicetext = require('@/components/options/slicetext')

export default {
  data: () => ({
    showList: null,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    items: [
      { key: 0, content: 'play next'},
      { key: 1, content: 'flash queue & play'}
    ]
  }),
  computed: {
    searchedList() {
      return this.$store.state.searchedData
    },
  },
  watch: {
    searchedList: function() {
      this.$emit('initSearchResult')
      this.showList = this.searchedList
    },
    select: function(newSelect) {
      switch(newSelect){
        case "everything":
          this.showList = this.searchedList
          break
        case "youtube":
          this.showList = this.searchedList.filter((value) => {
            return value.source == "youtube"
          })
          break
        case "gpm":
          this.showList = this.searchedList.filter((value) => {
            return value.source == "gpm"
          })
          break
      }
      document.querySelector('#search-result').scrollTop = 0
    }
  },
  props: {
    select: {type: String, required: true},
  },
  methods: {
    playMusic(music) {
      this.$store.dispatch("sendAsQueue", music.uri)
      this.emitSelectedMusic(music)
    },
    subSelectMenu(key, music) {
      switch(key){
        case 0:
          this.$store.dispatch("sendAsQueueToHead", music.uri)
          this.emitSelectedMusic(music)
          break
        case 1:
          this.$store.dispatch("sendAsPlay", music.uri)
          this.emitSelectedMusic(music)
          break
      }
    },
    emitSelectedMusic(music) {
      this.$emit('selectedMusic', music)
    }
  },
}
</script>
<style>
.searchResults:hover {
  background-color: rgb(175, 175, 175);
}
#search-result {
  position: relative;
  height: calc(100vh - 330px);
  width: 100%;
}
.searched-list-enter, .searched-list-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.searched-list-enter-to, .searched-list-leave {
  opacity: 1;
}
.searched-list-leave-active {
  position: absolute;
}
.queue-sub-menu:hover {
  background-color: rgb(225, 225, 225);
}
</style>
