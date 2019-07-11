<template>
  <v-card
    height="100%"
    width="100%"
  >
    <v-card-title>
      <strong style="font-size: 20px;">Contents</strong>
      <v-icon class="ml-2">fas fa-forward</v-icon>
    </v-card-title>
    <div id="playlist-contents">
      <perfect-scrollbar>
        <v-card
          class="playlist-content my-1 mx-auto"
          v-for="element in contents"
          :key="element.key"
          width="95%"
          max-width="760px"
          flat
        >
          <v-layout row wrap align-center ma-0 fill-height>
            <v-flex xs2 pa-0 @click="selectContent(element)">
              <v-img
                class="ma-auto"
                :src="element.thumbnail == '' ? src : element.thumbnail "
                contain
                max-height="50"
                max-width="50"
                :aspect-ratio="1/1"
              ></v-img>
            </v-flex>
            <v-flex xs9 py-2 @click="selectContent(element)">
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
                <v-list class="py-0">
                  <v-list-tile
                    v-for="item in items"
                    :key="item.key"
                    @click="playlistSubBtn(item.key, element)"
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
      </perfect-scrollbar>
    </div>
  </v-card>
</template>

<script>
import draggable from "vuedraggable"

const itemList = [
  { key: 0, content: "Play Next", icon: 'fas fa-play-circle'},
  { key: 1, content: "Play Now", icon: 'far fa-play-circle'},
  { key: 2, content: "Remove", icon: 'far fa-trash-alt'},
]

export default {
  display: "Transitions",
  components: {
    draggable,
  },
  data: () => ({
    items: itemList,
    select: false,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
  }),
  props: {
    theme: {type: Boolean, required: true},
    contents: {type: Array, required: true},
  },
  methods: {
    selectContent(element) {
      this.$store.dispatch("sendAsQueue", element.uri)
      this.$emit('toaster', element.title)
    },
    playlistSubBtn(order, element) {
      switch(order){
        case 0:
          this.$store.dispatch("sendAsQueueToHead", element.uri)
          this.$emit('toaster', element.title)
          break

        case 1:
          this.$store.dispatch("sendAsPlay", element.uri)
          this.$emit('toaster', element.title)
          break

        case 2:
          this.$emit('removeFromPlaylist', element.uri)
          break
      }
    }
  }
};
</script>
<style>
#playlist-contents {
  position: relative;
  height: calc(100vh - 250px); /* TODO */
  width: 100%;
}
.ps {
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.playlist-content {
  cursor: pointer;
}
.playlist-content:hover {
  background-color: rgb(170, 170, 170);
}
</style>
