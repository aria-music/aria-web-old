<template>
  <v-container fluid grid-list-md mb-5>
    <v-layout row wrap justify-space-around v-resize="onResize">
      <v-flex
        v-for="list in showPlaylists"
        :key="list.index"
      >
        <transition name="playlists">
          <v-card
            v-if="list.kind == 'playlist'"
            class="mx-auto playlist"
            width="280px"
            height="280px"
            :img="list.thumbnails[`${srcnum}`]"
            @click="selectPlaylist(list)"
          >
            <v-layout align-center fill-height>
              <v-flex>
                <v-card-text class="playlist-name">{{ list.name }}</v-card-text>
                <v-card-text class="playlist-length"><strong>{{ list.length }} songs</strong></v-card-text>
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
          <v-card @keyup.enter="addPlaylist">
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
                    <v-btn color="primary" @click="addPlaylist">save</v-btn>
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
    interval: 0,
    srcnum: 0,
    maxBoxSize: null,
    showPlaylists: null,
    newName: "",
    dialog: false,
    error: false,
    playlistsWithAdd: [],
  }),
  computed: {
    playlists() {
      return this.$store.state.playlists
    },
    decoyNum() {
      return this.maxBoxSize - (this.playlistsWithAdd.length % this.maxBoxSize)
    }
  },
  mounted() {
    this.onResize()
		this.changeThumbnail()
    this.$store.dispatch('fetchPlaylists')
	},
	beforeDestroy () {
		clearInterval(this.interval)
	},
  watch: {
    dialog: function(newVal) {
      if(!newVal){
        this.newName = ""
        this.error = false
      }
    },
    playlists: function() {
      let lists = this.playlists.map((property) => {
        return property
      })
      lists.push({
        index: lists.length,
        kind: 'add'
      })
      this.playlistsWithAdd = lists
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
        this.$store.dispatch('sendAsNewplaylist', this.newName)
      }
    },
    selectPlaylist(list) {
      this.$store.dispatch('sendAsPlaylist', list.name)
      setTimeout(() => {
        this.$router.push('/playlist')
      }, 300)
    },
    changeThumbnail() {
			this.interval = setInterval(() => {
				if(this.srcnum == 3) this.srcnum = 0
        else this.srcnum++
			}, 5000)
		},
  },
}
</script>
<style>
.playlist {
  transition: all 1.0s;
  opacity: 0.8;
}
.playlist-name {
  font-size: 24px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  text-shadow: 0px 0px 10px rgb(255, 255, 255);
}
.playlist-length {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 16px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  text-shadow: 0px 0px 10px rgb(255, 255, 255);
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