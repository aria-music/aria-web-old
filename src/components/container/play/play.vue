<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <playtitle
          :theme="theme"
          :nowPlaying="nowPlaying"
        />
      </v-flex>
      <v-flex d-flex>
        <v-layout column>
          <v-flex>
            <v-card height="100%">
              <v-sparkline
                fill
                :gradient="['#00c6ff', '#F0F', '#FF0']"
                line-width="2"
                padding="6"
                smooth="10"
                :value="value"
              ></v-sparkline>
            </v-card>
          </v-flex>
          <v-flex>
            <playlist
              :theme="theme"
              :nowPlaying="nowPlaying"
            />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import playlist from '@/components/container/play/play-list'
import playtitle from '@/components/container/play/play-title'

export default {
  data: () => ({
    value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
  }),
  computed: {
    nowPlaying() {
      return this.$store.state.playingData
    },
    theme() {
      return  this.$store.state.theme
    }
  },
  components: {
    playtitle,
    playlist,
  },
  methods: {
    //
  }
}
</script>
