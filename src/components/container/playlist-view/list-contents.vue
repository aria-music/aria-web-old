<template>
  <v-card height="100%">
    <v-card-title>
      <strong style="font-size: 20px;">Contents</strong>
      <v-icon class="ml-2">fas fa-forward</v-icon>
    </v-card-title>
    <div id="playlist-contents">
      <perfect-scrollbar>
        <v-card
          class="list-group-item my-1 mx-0"
          v-for="element in contents"
          :key="element.key"
          @click="selectContent(element)"
          flat
        >
          <v-layout row align-center ma-0>
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
                <v-list>
                  <v-list-tile
                    v-for="item in items"
                    :key="item.order"
                  >
                    <v-list-tile-title>
                      <div style="font-size: 14px">{{ item.name }}</div>
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
  "Remove from this playlist"
]

export default {
  display: "Transitions",
  components: {
    draggable,
  },
  data: () => ({
    items: itemList.map((name, index) => {
      return { name, order: index + 1 }
    }),
    select: false,
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
  }),
  props: {
    theme: {type: Boolean, required: true},
    contents: {type: Array, required: true},
  },
  methods: {
    selectContent(element) {
      //
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
/* .flip-list-move {
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
} */
/* .card:hover {
  background-color: lightgray;
} */
</style>
