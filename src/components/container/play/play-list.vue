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
                      :src="element.thumbnail == '' ? swichToNoimage(element) : element.thumbnail"
                      @error="swichToNoimage(element)"
                      contain
                      max-height="50"
                      max-width="50"
                      :aspect-ratio="1/1"
                    ></v-img>
                  </v-flex>
                  <v-flex xs8 pa-0 @click="skipTo(element)">
                    <v-card-text>
                      <strong>{{ element.title }}</strong>
                    </v-card-text>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs1>
                    <funcbtn
                     :element="element"
                     :funcs="[
                        'like',
                        'addList',
                        'removeQueue'
                      ]"
                    />
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
  </v-card>
</template>
<script>
import draggable from "vuedraggable"
import funcbtn from "@/components/options/functional_button/func-btn"

export default {
  display: "Transitions",
  components: {
    draggable,
    funcbtn,
  },
  data: () => ({
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    dialog: false,
  }),
  computed: {
    queue: {
      get() {
        return this.$store.state.queue
      },
      set(queue) {
        this.$store.commit('changeQueue', queue)
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
        ghostClass: "ghost",
        forceFallback: true,
      }
    },
  },
  props: {
    theme: {type: Boolean, required: true},
    nowPlaying: {type: Object, required: true},
  },
  methods: {
    removeFromQueue(element) {
      this.$store.dispatch('sendAsRemoveFromQueue', element)
    },
    skipTo(element) {
      this.$store.dispatch('sendAsSkipTo', element)
    },
    swichToNoimage(element) {
      element.thumbnail = this.src
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
</style>
