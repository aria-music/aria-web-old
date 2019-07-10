<template>
  <v-card class="pa-3" height="100%">
    <v-card
      max-height="350"
      max-width="350"
      class="mx-auto"
      :class="theme ? 'grey lighten-3' : 'grey darken-3'"
    >
      <v-img
        :src="thumbnail"
        contain
        class="img-size"
        :aspect-ratio="1/1"
      ></v-img>
    </v-card>
    <v-card
      class="mt-3 mx-auto width"
    >
      <v-card-title class="playing-title">
        {{ title }}
      </v-card-title>
      <v-divider class="mx-3"></v-divider>
      <v-toolbar
          color="transparent"
          flat
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            flat
            @click="queueAll"
            class="my-0 py-3"
          >
            <v-icon>fas fa-plus</v-icon>
            <div class="ml-2 pt-1">Queue</div>
          </v-btn>
          <v-btn
            flat
            @click="playAll"
            class="my-0 py-3"
          >
            <v-icon>play_arrow</v-icon>
            <div class="ml-1 pt-1">Play</div>
          </v-btn>
          <!-- <v-btn
            icon
            key="share"
            @click="torf = !torf"
            class="mr-0"
          >
            <v-icon>share</v-icon>
          </v-btn> -->
          <!-- <v-btn
            v-if="torf"
            icon
            key="twitter"
            class="mr-0"
          >
            <v-icon>fab fa-twitter</v-icon>
          </v-btn>
          <v-btn
            v-if="torf"
            icon
            key="facebook"
            class="mr-0"
          >
            <v-icon>fab fa-facebook-square</v-icon>
          </v-btn> -->
          <v-dialog
            v-model="dialog"
            max-width="450"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
              ><v-icon>far fa-trash-alt</v-icon></v-btn>
            </template>
            <v-card>
              <v-container grid-list-xs>
                <v-layout row wrap>
                  <v-icon
                    class="mx-auto"
                    large
                    color="error"
                  >fas fa-exclamation-triangle</v-icon>
                  <v-flex xs12>
                    <span class="headline">Are you sure to delete this playlist <strong>{{ title }}</strong> ?</span>
                  </v-flex>
                  <v-flex>
                    <v-layout justify-end>
                      <v-btn @click="deletePlaylist">YES</v-btn>
                      <v-btn color="error" @click="dialog = false">NO</v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    torf: false,
    dialog: false,
  }),
  props: {
    theme: {type: Boolean, required: true},
    thumbnail: {type: String, required: true},
    title: {type: String, required: true},
  },
  methods: {
    playAll() {
      this.$emit('playAll')
      this.$emit('toaster', this.title)
    },
    queueAll() {
      this.$emit('queueAll')
      this.$emit('toaster', this.title)
    },
    deletePlaylist() {
      this.$emit('deletePlaylist', this.title)
    }
  },
}
</script>
<style>
.width {
  min-width: 250px;
}
@media(min-width: 887px){
  .width{
    width: 350px;
  }
}
.playing-title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 1%;
}
</style>