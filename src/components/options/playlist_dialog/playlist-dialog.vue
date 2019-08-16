<template>
  <v-dialog
    v-model="showDialog"
    max-width="400px"
  >
    <v-card height="400">
      <v-card-title><v-icon class="mr-2 pb-1">fas fa-plus</v-icon><strong style="font-size: 18px">Playlists</strong></v-card-title>
      <v-divider></v-divider>
      <v-card-text class="playlist-dialog-container">
        <perfect-scrollbar>
          <v-card
            v-for="playlist in playlists"
            :key="playlist.index"
            @click="addToPlaylist(playlist.name)"
            class="playlist-dialog"
            width="390"
            flat
          >
            <v-card-text class="my-0">
              <span>
                <v-icon class="mr-2">fas fa-list-ul</v-icon>
                <span>{{ playlist.name }}</span>
              </span>
            </v-card-text>
          </v-card>
          <v-card
            @click="creatNewPlaylist()"
            class="playlist-dialog"
            width="390"
            flat
          >
            <v-card-text class="my-0">
              <span>
                <v-icon class="mr-2">fas fa-plus</v-icon>
                <span>New Playlist</span>
              </span>
            </v-card-text>
          </v-card>
        </perfect-scrollbar>
      </v-card-text>
    </v-card>
    <createPlaylistDialog
      :dialog="plDialog"
    />
  </v-dialog>
</template>
<script>
import createPlaylistDialog from '@/components/options/create_playlist_dialog/create-playlist-dialog'

export default {
  data: () =>({
    showDialog: false,
    plDialog: false,
  }),
  components: {
    createPlaylistDialog
  },
  props: {
    songUri: {type: String, required: true},
    dialog: {type: Boolean, required: true}
  },
  watch: {
    dialog: function() {
      this.showDialog = true
    }
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.map((property, index) => {
        property.index = index
        return property
      })
    },
  },
  methods: {
    addToPlaylist(playlistName) {
      this.$store.dispatch('sendAsAddToPlaylist', { listname: playlistName, addedUri: this.songUri })
      this.showDialog = false
    },
    creatNewPlaylist() {
      this.plDialog = !this.plDialog
    }
  },
}
</script>
<style>
.playlist-dialog-container {
  position: relative;
  height: calc(100% - 61px);
  padding: 0;
}
.playlist-dialog {
  cursor: pointer;
  margin-right: 0;
}
.playlist-dialog:hover {
  background-color: rgb(175, 175, 175);
}
</style>

