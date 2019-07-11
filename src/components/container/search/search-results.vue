<template>
  <v-card>
    <v-container>
      <perfect-scrollbar id="search-result">
        <transition-group name="searched-list">
          <v-card
            class="searchResults mx-0 px-0"
            v-for="result in showList"
            :key="result.key"
            height="100"
            width="98%"
            flat
          >
            <v-layout row wrap align-center fill-height>
              <v-flex xs2 align-center @click="playMusic(result)">
                <v-img
                  class="ma-auto"
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
                        <v-icon class="my-0 pa-0">{{ result.source == 'youtube' ? 'fab fa-youtube' : 'fab fa-google-play' }}</v-icon>
                      </v-flex>
                      <v-flex v-if="result.source == 'gpm'">
                        <v-card-text class="py-0 pl-0">
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
                        <div style="font-size: 14px">
                          <v-icon>{{ item.icon }}</v-icon>
                          <span class="ml-2">{{ item.content }}</span>
                        </div>
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
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
      max-height="600px"
    >
      <v-card>
        <v-card-title><v-icon class="mr-2 pb-1">fas fa-plus</v-icon><strong style="font-size: 18px">Playlists</strong></v-card-title>
        <v-divider></v-divider>
          <v-card
            v-for="playlist in playlists"
            :key="playlist.index"
            @click="addToPlaylist(playlist.name)"
            @mouseup="color = true"
            @mousedown="color = false"
            style="cursor: pointer"
            flat
          >
            <v-card-text class="my-0"><v-icon class="mr-2">fas fa-list-ul</v-icon>{{ playlist.name }}</v-card-text>
          </v-card>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
const slicetext = require('@/components/options/slicetext')

const itemlist = [
  { key: 0, content: 'Play Next', icon: 'fas fa-play-circle'},
  { key: 1, content: 'Play Now', icon: 'far fa-play-circle'},
  { key: 2, content: 'Add to Playlist', icon: 'fas fa-plus'}
]

export default {
  data: () => ({
    showList: null,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    items: itemlist,
    dialog: false,
    color: false,
    selected: '',
  }),
  computed: {
    searchedList() {
      return this.$store.state.searchedData
    },
    playlists() {
      return this.$store.state.playlists
    }
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
        case 2:
          this.selected = music.uri
          this.dialog = true
          break
      }
    },
    emitSelectedMusic(music) {
      this.$emit('selectedMusic', music)
    },
    addToPlaylist(playlist) {
      this.$store.dispatch('sendAsAddToPlaylist', { listname: playlist, addedUri: this.selected })
      this.dialog = false
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
