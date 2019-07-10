<template>
  <header>
    <v-toolbar
      height="65"
      app
      fixed
    >
      <div class="mx-auto" :style="{width: `${width}px`}">
        <v-layout row align-center>
          <v-flex xs8>
            <v-toolbar-title style="width: 150px" class="ml-0 pl-3">
            <div
              @click="goPlaylist"
              style="cursor: pointer"
            >
              <v-icon style="margin-bottom: 2px">navigation</v-icon>
              <span>ria_music</span>
            </div>
            </v-toolbar-title>
          </v-flex>
          <v-flex xs4>
            <v-layout align-center justify-end>
              <v-flex shrink>
                <v-btn
                  flat
                  round
                  icon
                  class="mr-3"
                  :color="color"
                  @mouseover="color='pink lighten-3'"
                  @mouseout="color=''"
                  @click="goPlaylist"
                ><v-icon>list</v-icon>
                </v-btn>
              </v-flex>
              <v-flex grow>
                <v-text-field
                  flat
                  v-model="text"
                  class="mt-2"
                  prepend-inner-icon="search"
                  clearable
                  color="pink lighten-3"
                  @click:prepend-inner="sendWithSearch"
                  @keyup.enter="sendWithSearch"
                  @keypress="canMessageSend = true"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-toolbar>
  </header>
</template>

<script>
export default {
  name: 'ariaHeader',
  data: () => ({
    text: "",
    color: "",
    canMessageSend: false,
  }),
  props: {
    width: {type: Number, required: true}
  },
  methods: {
    goPlaylist() {
      this.$router.push('/')
      this.$store.dispatch('fetchPlaylists')
    },
    sendWithSearch() {
      if(this.canMessageSend){
        this.canMessageSend = false
        this.$store.dispatch('sendAsSearch', this.text)
        this.text = ""
        this.$router.push('/search')
      }else return
    }
  }
}
</script>
