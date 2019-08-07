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
          class="playlist-content my-0 mx-auto"
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
              <funcbtn
                :element="element"
                :funcs="[
                  'playnext',
                  'playnow',
                  'removeList'
                ]"
                :playlistName="playlistName"
              />
            </v-flex>
          </v-layout>
        </v-card>
      </perfect-scrollbar>
    </div>
  </v-card>
</template>

<script>
import draggable from "vuedraggable"
import funcbtn from "@/components/options/functional_button/func-btn"

export default {
  display: "Transitions",
  components: {
    draggable,
    funcbtn
  },
  data: () => ({
    select: false,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
  }),
  props: {
    theme: {type: Boolean, required: true},
    contents: {type: Array, required: true},
    playlistName: {type: String, required: true},
  },
  methods: {
    selectContent(element) {
      this.$store.dispatch("sendAsQueue", element.uri)
      this.$emit('toaster', element.title)
    },
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
  background-color: rgb(175, 175, 175);
}
.list-sub-menu:hover {
  background-color: rgb(175, 175, 175);
}
</style>
