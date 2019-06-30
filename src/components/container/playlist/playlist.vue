<template>
  <v-container fluid grid-list-md mb-5 mt-3 class="playlist">
    <v-layout row wrap justify-space-around v-resize="onResize">
      <v-flex
        v-for="list in showPlaylists"
        :key="list.index"
      >
        <transition name="playlists">
          <v-card
            v-if="list.kind == 'playlist'"
            class="mx-auto"
            width="280px"
            height="280px"
            :img="list.img"
            style="transition: all 1.0s;"
          >
            <v-layout align-center fill-height>
              <v-flex>
                <v-card-text>
                  {{ list.name }}
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </transition>
        <v-dialog
          v-if="list.kind == 'add'"
          v-model="dialog"
          max-width="450"
        >
          <template v-slot:activator="{ on }">
            <transition name="addlist">
              <v-card
                class="mx-auto"
                width="280px"
                height="280px"
                flat
                style="transition: all 1.0s;"
                :ripple="{ center: true }"
                v-on="on"
              >
                <v-layout justify-center align-center fill-height>
                  <v-flex d-flex>
                    <v-icon large>fas fa-plus</v-icon>
                  </v-flex>
                </v-layout>
              </v-card>
            </transition>
          </template>
        <v-card>
          <v-card-text>
            <span class="headline">New Playlist</span>
          </v-card-text>
          <v-container grid-list-xs>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="newName"
                  :error="error"
                  label="Title"
                  counter
                  maxlength="30"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-layout justify-end>
                  <v-btn flat @click="dialog = false">cancel</v-btn>
                  <v-btn color="primary" @click="addPlaylist" @keyup.enter="addPlaylist">save</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
        <v-card
          v-if="list.kind == 'decoy'"
          class="mx-auto"
          width="280px"
          height="280px"
          color="transparent"
          flat
        >
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    maxBoxSize: null,
    showPlaylists: null,
    newName: "",
    dialog: false,
    error: false,
  }),
  computed: {
    playlists() {
      return this.$store.state.playlists
    },
    playlistsWithAdd() {
      let lists = this.playlists.map((property) => {
        return property
      })
      lists.push({
        index: lists.length,
        kind: 'add'
      })
      return lists
    },
    decoyNum() {
      return this.maxBoxSize - (this.playlistsWithAdd.length % this.maxBoxSize)
    }
  },
  mounted() {
    this.onResize()
  },
  watch: {
    dialog: function(newVal) {
      if(!newVal){
        this.newName = ""
        this.error = false
      }
    },
    playlistsWithAdd: function() {
      this.onResize()
    }
  },
  methods: {
    onResize() {
      const maxBoxSize = (() => {
        let width = window.innerWidth
        if(width >= 1192) return 4
        if(width >= 888) return 3
        if(width >= 600) return 2
        return 1
      })()
      this.maxBoxSize = maxBoxSize
      this.makeLists()
    },
    makeLists() {
      this.showPlaylists = this.playlistsWithAdd.map((property) => {
        return property
      })
      if(this.decoyNum != this.maxBoxSize){
        for(var i = 0; i < this.decoyNum; i++){
          this.showPlaylists.push({
            index: this.showPlaylists.length,
            kind: 'decoy'
          })
        }
      }
    },
    addPlaylist() {
      if(this.newName == "") this.error = true
      else {
        this.dialog = false
        this.$store.commit('addPlaylist', this.newName)
      }
    }
  }
}
</script>
<style>
@media(min-width: 1200px){
  .playlist {
    width: 1200px;
  }
}
.playlists-enter, .playlists-leave-to {
  opacity: 0;
}
.playlists-enter-to, .playlists-leave {
  opacity: 1;
}
.playlists-leave-active {
  position: absolute;
}
.addlist-enter-active .addlist-leave-active{
  transform: rotate(360deg)
}
.addlist-leave-active {
  position: absolute;
}
</style>