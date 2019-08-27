<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex
        shrink
        class="playlist-contents"
      >
        <contentsTitle
          :theme="theme"
          :entry="playlistContents.entries"
          :title="playlistContents.name"
          v-on:playAll="playAll"
          v-on:queueAll="queueAll"
          v-on:toaster="toaster"
          v-on:deletePlaylist="deletePlaylist"
        />
      </v-flex>
      <v-flex>
        <listContents
          :theme="theme"
          :contents="entries"
          :playlistName="playlistContents.name"
          v-on:toaster="toaster"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contentsTitle from '@/components/container/playlist-view/contents-title'
import listContents from '@/components/container/playlist-view/list-contents'
import toast from '@/components/options/toaster/toastCore'
const slicetext = require('@/components/options/slicetext')

export default {
  data: () => ({
    nowSelect: {},
    hover: false,
  }),
  computed: {
    theme() {
      return this.$store.state.theme
    },
    playlistContents() {
      return this.$store.state.forcusedPlaylist
    },
    entries() {
      return this.playlistContents.entries.map((property, index) => {
        property.key = index
        return property
      })
    }
  },
  created() {
    if(this.playlistContents.length == 0){
      this.playlistContents.entries = []
      this.playlistContents.name = ""
      this.$router.push('/')
    }
  },
  components: {
    contentsTitle,
    listContents,
  },
  methods: {
    selectContents(element) {
      this.nowSelect = element
    },
    playAll() {
      this.$store.dispatch('sendAsPlayWithPlaylist', this.playlistContents.name)
    },
    queueAll() {
      this.$store.dispatch('sendAsQueueWithPlaylist', this.playlistContents.name)
    },
    toaster(message) {
      const title = message > 22 ? slicetext(message, 22) : message
      toast(title)
    },
    deletePlaylist(title) {
      this.$router.push('/')
      this.$store.dispatch('sendAsDeletePlaylist', title)
    }
  }
}
</script>
