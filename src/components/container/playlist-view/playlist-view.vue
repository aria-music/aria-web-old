<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <contentsTitle
          :theme="theme"
          :thumbnail="playlistContents.entries[1].thumbnail"
          :title="playlistContents.name"
          v-on:playAll="playAll"
        />
      </v-flex>
      <v-flex d-flex>
        <v-flex>
          <listContents
            :theme="theme"
            :contents="entries"
          />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contentsTitle from '@/components/container/playlist-view/contents-title'
import listContents from '@/components/container/playlist-view/list-contents'

export default {
  data: () => ({
    nowSelect: {},
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
      this.$store.dispatch('sendAsPlayWithPlaylist', this.playlistContents.entries)
    }
  }
}
</script>
