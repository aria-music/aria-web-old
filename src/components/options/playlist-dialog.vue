<template>
  <v-dialog
    v-model="dialog"
    max-width="400px"
  >
    <v-card style="height: 400px">
      <v-card-title><v-icon class="mr-2 pb-1">fas fa-plus</v-icon><strong style="font-size: 18px">Playlists</strong></v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="playlist-dialog-container"
      >
        <perfect-scrollbar>
          <v-card
            v-for="playlist in playlists"
            :key="playlist.index"
            @click="addToPlaylist(playlist.name)"
            class="playlist-dialog"
            flat
          >
            <v-card-text
              class="my-0"
              height=""
            >
              <span>
                <v-icon class="mr-2">fas fa-list-ul</v-icon>
                {{ playlist.name }}
              </span>
            </v-card-text>
          </v-card>
        </perfect-scrollbar>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () =>({
    dialog: false,
  }),
  props: {
    songUri: {type: String, required: true},
    showDialog: {type: Boolean, required: true}
  },
  watch: {
    showDialog: function() {
      this.dialog = true
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
      this.dialog = false
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

