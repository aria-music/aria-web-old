<template>
  <v-container fluid grid-list-md mb-5 mt-3 class="playing">
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <playtitle
          :theme="theme"
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
            <playlist/>
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
<style>
@media(min-width: 1200px){
  .playing {
    width: 1200px;
  }
}
</style>
