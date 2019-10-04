<template>
  <v-card>
    <v-container>
      <perfect-scrollbar id="search-result">
        <transition-group name="searched-list">
          <v-card
            mx-0
            px-0
            v-for="result in showList"
            :key="result.key"
            height="100"
            width="98%"
            flat
          >
            <v-layout row wrap align-center fill-height ma-0>
              <v-flex xs2 align-center @click="playMusic(result)">
                <v-img
                  class="ma-auto"
                  @error="switchToNoimage(result)"
                  :src="result.thumbnail_small == '' ? switchToNoimage(result) : result.thumbnail_small"
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
                      <strong v-if="result.source == 'youtube'">{{ result.title.length > 100 ? result.sliceTitle : result.title }}</strong>
                      <strong v-if="result.source == 'gpm'">{{ result.entry.title }}</strong>
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
                          <strong>{{ result.entry.artist.length > 20 ? result.entry.artist.slice(0, 20)+'...' : result.entry.artist}}</strong>
                          <v-icon small class="ml-3  mr-1">fas fa-compact-disc</v-icon>
                          <strong>{{ result.entry.album.length > 20 ? result.entry.album.slice(0, 20)+'...' : result.entry.album}}</strong>
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
                <funcbtn
                  :element="result"
                  :funcs="[
                    'playnext',
                    'playnow',
                    'addList'
                  ]"
                />
              </v-flex>
            </v-layout>
          </v-card>
        </transition-group>
      </perfect-scrollbar>
    </v-container>
  </v-card>
</template>
<script>
import funcbtn from "@/components/options/functional_button/func-btn"
import toast from '@/components/options/toaster/toastCore'
const slicetext = require('@/components/options/slicetext')

export default {
  data: () => ({
    showList: [],
    searchedList: [],
    src: require('@/assets/icon/no_image.png'),
  }),
  computed: {
    searchedData() {
      return this.$store.state.searchedData
    },
  },
  components: {
    funcbtn
  },
  props: {
    select: {type: String, required: true},
  },
  mounted() {
    // localStorage.removeItem('searchedResult')
    const dataInStorage = JSON.parse(localStorage.searchedResult)
    if(dataInStorage != null) this.searchedList = dataInStorage
  },
  watch: {
    searchedData: function(newData) {
      this.searchedList = newData
      localStorage.searchedResult = JSON.stringify(newData)
    },
    searchedList: function(newList) {
      const list = newList.map((property) => {
        if(property.source == 'youtube') property.sliceTitle = slicetext(property.title, 100)
        return property
      })
      this.$emit('initSearchResult')
      this.showList = newList
    },
    select: function(newSelect) {
      const list = this.searchedList
      switch(newSelect){
        case "everything":
          this.showList = list
          break
        case "youtube":
          try{
            this.showList = list.filter((value) => {
              return value.source == "youtube"
            })
          }finally{
            break
          }
        case "gpm":
          try{
            this.showList = list.filter((value) => {
              return value.source == "gpm"
            })
          }finally{
            break
          }
      }
      document.querySelector('#search-result').scrollTop = 0
    }
  },
  methods: {
    playMusic(result) {
      this.$store.dispatch("sendAsQueue", result.uri)
      this.toaster(result.title)
    },
    switchToNoimage(result) {
      result.thumbnail = this.src
    },
    toaster(title) {
      const slicedTitle = title.length > 22 ? slicetext(title, 22) : title
      toast(slicedTitle)
    }
  },
}
</script>
<style>
.searchResults {
  cursor: pointer;
}
.searchResults:hover {
  background-color: rgb(175, 175, 175);
}
.queue-sub-menu:hover {
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
</style>
