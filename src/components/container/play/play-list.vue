<template>
  <v-card height="100%">
    <v-card-title class="pb-2">
      <strong style="font-size: 20px;">Next up</strong>
      <v-icon class="ml-2">fas fa-forward</v-icon>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog"
        max-width="410px"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
          ><v-icon small>fas fa-trash</v-icon></v-btn>
        </template>
        <v-card>
          <v-container grid-list-xs>
            <v-layout row wrap>
              <v-icon
                class="mx-auto"
                large
                color="error"
              >fas fa-exclamation-triangle</v-icon>
              <v-flex xs12 style="text-align: center">
                <span
                  class="headline mx-auto"
                >Are you sure to delete this queue?</span>
              </v-flex>
              <v-flex mt-3>
                <v-layout justify-end>
                  <v-btn @click="clearQueue">YES</v-btn>
                  <v-btn color="error" @click="dialog = false">NO</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
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
                          :key="item.key"
                          class="sub-menu"
                          @click="subMenuFunc(item.key, element)"
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
                  <v-flex xs1>
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
    </div>
    <playlistDialog
      :songUri="songUri"
      :showDialog="showDialog"
    />
  </v-card>
</template>
<script>
import draggable from "vuedraggable"
import playlistDialog from "@/components/options/playlist-dialog"

const itemList = [
  { key: 0, content: "Like", icon: 'fas fa-heart'},
  { key: 1, content: "Add to Playlist", icon: 'fas fa-plus'},
  { key: 2, content: "Remove", icon: 'far fa-trash-alt'},
]

export default {
  display: "Transitions",
  components: {
    draggable,
    playlistDialog,
  },
  data: () => ({
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    items: itemList,
    dialog: false,
    showDialog: false,
    songUri: "",
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
          this.songUri = element.uri
          this.showDialog = !this.showDialog
          break
        case 2:
          this.removeFromQueue(element)
          break
      }
    },
    removeFromQueue(element) {
      this.$store.dispatch('sendAsRemoveFromQueue', element)
    },
    editMenuFunc(key) {
      switch(key){
        case 0:
          break
        case 1:
          this.dialog = true
          break
      }
    },
    clearQueue() {
      this.$store.dispatch('sendAsClearQueue')
      this.dialog = false
    }
  }
};
</script>
<style>
#playing-list {
  position: relative;
  height: calc(100vh - 450px); /* TODO */
  max-width: 760px;
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
