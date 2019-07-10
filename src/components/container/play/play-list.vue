<template>
  <v-card height="100%">
    <v-card-title>
      <strong style="font-size: 20px;">Next up</strong>
      <v-icon class="ml-2">fas fa-forward</v-icon>
    </v-card-title>
    <div id="playing-list">
      <perfect-scrollbar>
        <draggable
          class="list-group"
          v-model="queue"
          v-bind="dragOptions"
          handle=".handle"
        >
          <transition-group type="transition" name="null">
            <li
              class="list-group-item my-1"
              v-for="element in queue"
              :key="element.index"
            >
              <v-card
                class="mx-2 pa-0 card"
                flat
              >
                <v-layout row align-center wrap>
                  <v-flex xs2 pa-0>
                    <v-img
                      class="ma-auto"
                      :src="element.thumbnail == '' ? src : element.thumbnail "
                      contain
                      max-height="50"
                      max-width="50"
                      :aspect-ratio="1/1"
                    ></v-img>
                  </v-flex>
                  <v-flex xs8>
                    <strong>{{ element.title }}</strong>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs1>
                    <v-menu
                      bottom
                      origin="center center"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
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
                          :key="item.order"
                          class="sub-menu"
                          @click="subMenuFunc(item.order, element)"
                        >
                          <v-list-tile-title>
                            <div style="font-size: 14px">{{ item.name }}</div>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </v-flex>
                  <v-flex>
                    <v-btn
                      icon
                      class="handle"
                    >
                      <v-icon small>fas fa-bars</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </li>
          </transition-group>
        </draggable>
      </perfect-scrollbar>
      <v-dialog
        v-model="dialog"
        scrollable
        max-width="500px"
        max-height="600px"
        transition="dialog-transition"
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
    </div>
  </v-card>
</template>
<script>
import draggable from "vuedraggable"

const itemList = [
  "Like this video",
  "add to playlist",
  "Remove from this queue"
]

export default {
  display: "Transitions",
  components: {
    draggable,
  },
  data: () => ({
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    items: itemList.map((name, index) => {
      return { name, order: index }
    }),
    dialog: false,
    color: false,
    selectedSong: "",
  }),
  computed: {
    queue: {
      get() {
        return this.$store.state.queue
      },
      set(queue) {
        this.$store.dispatch('sendAsEditedQueue', queue.map((property) => {
          return property.uri
        }))
      }
    },
    playlists() {
      return this.$store.state.playlists.map((property, index) => {
        property.index = index
        return property
      })
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      }
    },
  },
  props: {
    theme: {type: Boolean, required: true},
    nowPlaying: {type: Object, required: true},
  },
  methods: {
    subMenuFunc(order, element) {
      switch(order){
        case 0:
          this.$store.dispatch('sendAsLike', element.uri)
          break
        case 1:
          this.dialog = true
          this.selectedSong = element.uri
          break
        case 2:
          this.removeFromQueue(element)
          break
      }
    },
    removeFromQueue(element) {
      this.$store.dispatch('sendAsRemoveFromQueue', element)
    },
    addToPlaylist(playlist) {
      this.$store.dispatch('sendAsAddToPlaylist', { listname: playlist, addedUri: this.selectedSong })
      this.dialog = false
    }
  }
};
</script>
<style>
#playing-list {
  position: relative;
  height: calc(100vh - 450px); /* TODO */
  width: 100%;
}
.ps {
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: pointer;
  list-style-type: none;
}
.sub-menu:hover {
  background-color: rgb(175, 175, 175);
}
</style>
