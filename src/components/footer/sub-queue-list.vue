<template>
  <v-menu
    v-model="isClose"
    :close-on-content-click="false"
    top
    offset-y
    origin="bottom right"
    transition="scale-transition"
    ><template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        class="mr-3"
      ><v-icon>playlist_play</v-icon>
      </v-btn>
    </template>
    <v-card
      height="500"
      width="300">
      <v-card-title class="pb-0">
        <strong class="ml-2" style="font-size: 22px">Queue</strong>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="isClose = false"
        ><v-icon>clear</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mx-3"></v-divider>
      <div class="sub-queue-list">
        <perfect-scrollbar>
          <v-card
            v-for="element in queue"
            :key="element.index"
            class="mx-2 pa-0"
            flat
          >
            <v-layout row align-center>
              <v-flex xs2 pa-0>
                <v-img
                  class="ma-auto"
                  :src="element.thumbnail_small == '' ? src : element.thumbnail_small "
                  contain
                  max-height="50"
                  max-width="50"
                  :aspect-ratio="1/1"
                ></v-img>
              </v-flex>
              <v-flex xs10 ml-2>
                <strong style="font-size: 12px" v-if="showText">{{ element.title.slice(0,30)+'...' }}</strong>
              </v-flex>
            </v-layout>
          </v-card>
        </perfect-scrollbar>
      </div>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  data: () => ({
    src: require('@/assets/icon/no_image.png'),
		isClose: false,
    showText: true,
  }),
  computed: {
    queue() {
      return this.$store.state.queue
    },
  },
}
</script>
