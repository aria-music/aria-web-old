<template>
  <v-container fluid grid-list-md class="playing">
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <contentsTitle
          :theme="theme"
          :nowSelect="nowSelect"
        />
      </v-flex>
      <v-flex d-flex>
        <v-flex>
          <playlist
            :theme="theme"
            v-on:selectContents="selectContents"
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
    //
  }),
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
  components: {
    contentsTitle,
    listContents,
  },
  methods: {
    selectContents(element) {
      this.nowSelect = element
    }
  }
}
</script>
<style>
@media(min-width: 1200px){
  .playing {
    width: 1200px;
  }
}
</style>
