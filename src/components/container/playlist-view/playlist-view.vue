<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex
        shrink
        class="playlist-contents"
      >
        <contentsTitle
          :theme="theme"
          :thumbnail="playlistContents.entries[0].thumbnail || ''"
          :title="playlistContents.name"
          v-on:playAll="playAll"
          v-on:toaster="toaster"
        />
      </v-flex>
      <v-flex>
        <v-flex>
          <listContents
            :theme="theme"
            :contents="entries"
            v-on:removeFromPlaylist="removeFromPlaylist"
            v-on:toaster="toaster"
          />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contentsTitle from '@/components/container/playlist-view/contents-title'
import listContents from '@/components/container/playlist-view/list-contents'
import toast from '@/components/options/toastCore'
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
  watch: {
    playlistContent: function() {
      if(this.playlistContents == []) this.$router.push('/')
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
    removeFromPlaylist(removeUri) {
      this.$store.dispatch('sendAsRemoveFromPlaylist', {playlistName: this.playlistContents.name, removeUri: removeUri})
      this.$store.dispatch('sendAsPlaylist', this.playlistContents.name)
    },
    toaster(message) {
      const title = message > 22 ? slicetext(message, 22) : message
      toast(title)
    }
  }
}
</script>
