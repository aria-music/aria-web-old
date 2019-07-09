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
                <v-layout row align-center>
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
                  <v-flex xs7>
                    <strong>{{ element.title }}</strong>
                  </v-flex>
                  <v-flex xs1 offset-xs1>
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
    </div>
  </v-card>
</template>
<script>
import draggable from "vuedraggable"

const itemList = [
  "Like this video",
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
      return { name, order: index++ }
    }),
    select: false,
  }),
  computed: {
    queue: {
      get() {
        return this.$store.state.queue
      },
      set(queue) {
        this.$store.dispatch('sendAsListQueue', queue.map((property) => {
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
      };
    },
  },
  props: {
    theme: {type: Boolean, required: true},
    nowPlaying: {type: Object, required: true},
  },
  methods: {
    // goPlaylist(element) {
    //   this.$store.commit('nowPlaying', element)
    // },
    subMenuFunc(order, element) {
      switch(order){
        case 0:
          break
        case 1:
          this.removeFromQueue(element)
          break
      }
    },
    removeFromQueue(element) {
      this.$store.dispatch('sendAsRemoveFromQueue', element)
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
/* .card:hover {
  background-color: lightgray;
} */
</style>
