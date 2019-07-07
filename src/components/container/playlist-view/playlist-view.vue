<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <contentsTitle
          :theme="theme"
        />
      </v-flex>
      <v-flex d-flex>
        <v-flex>
          <listContents
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
    nowSelect: {},
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
