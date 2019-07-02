<template>
  <v-card>
    <v-container>
      <perfect-scrollbar id="search-result">
        <transition-group name="searched-list">
          <v-card
            v-for="result in showList"
            :key="result.key"
            height="100"
            width="95%"
            flat
          >
            <v-layout row wrap align-center>
              <v-flex xs2>
                <v-img
                  class="mx-auto"
                  :src="result.thumbnail == '' ? src : result.thumbnail "
                  contain
                  max-height="80"
                  max-width="80"
                  :aspect-ratio="1/1"
                ></v-img>
              </v-flex>
              <v-flex xs10>
                <v-layout column>
                  <v-flex>
                    <v-card-title class="pl-1 py-0">
                      <strong>{{ result.source == 'youtube' ? result.title : result.entry.title}}</strong>
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
                      <!-- <v-flex xs1>
                        <v-btn
                          icon
                          flat
                          @click="result.isFavorite = !result.isFavorite"
                          :color="result.isFavorite ? 'pink lighten-3' : ''"
                          ><v-icon v-if="result.isFavorite" color="pink darken-1">favorite</v-icon>
                          <v-icon v-else>favorite_border</v-icon>
                        </v-btn>
                      </v-flex> -->
                      <v-flex xs1>
                        <v-btn
                          icon
                          flat
                          ><v-icon small>fas fa-ellipsis-v</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </transition-group>
      </perfect-scrollbar>
    </v-container>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    showList: null,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
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
}
</script>
<style>
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
