<template>
  <v-container fluid grid-list-md class="serched">
    <v-layout column wrap>
      <v-flex>
        <v-card>
          <v-card-text style="font-size: 24px;">
            <strong>Search results for "{{ searchContents }}"</strong>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-layout row wrap>
          <v-flex d-flex xs3>
            <v-layout row wrap>
              <v-flex d-flex xs1 offset-xs1>
                <v-card
                  height="100%"
                  color="pink accent-2"
                >
                </v-card>
              </v-flex>
              <v-flex d-flex xs9>
                <v-layout column wrap>
                  <v-flex xs12>
                    <v-layout
                      row
                      align-center
                      v-for="item in items"
                      :key="item.key"
                    >
                      <v-flex>
                        <v-card
                          style="cursor: pointer"
                          @click="select = item.selecter"
                          :flat="item.selecter == select"
                          :ripple="item.selecter != select"
                          :color="item.selecter == select ? 'transparent' : ''"
                        >
                          <v-card-title>
                            <v-icon
                              class="mr-2"
                              :color="item.selecter == select ? item.color : ''"
                            >{{ item.icon }}</v-icon>
                            <strong>{{ item.value }}</strong>
                          </v-card-title>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex xs9>
            <v-layout column wrap>
              <v-flex>
                <results
                  :select="select"
                  v-on:initSearchResult="initSearchResult"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import results from '@/components/container/search/search-results'

export default {
  data: () => ({
    items: [
      {key: 0, value: 'Everything', selecter: 'everything', icon: 'fas fa-headphones', color: 'pink accent-3'},
      {key: 1, value: 'Youtube', selecter: 'youtube', icon: 'fab fa-youtube', color: 'red'},
      {key: 2, value: 'Google play music', selecter: 'gpm', icon: 'fab fa-google-play', color: 'orange accent-3'},
    ],
    select: 'everything',
  }),
  computed: {
    searchContents() {
      return this.$store.state.searchContents
    }
  },
  components: {
    results,
  },
  methods: {
    initSearchResult() {
      this.select = 'everything'
    }
  }
}
</script>
<style>
@media(min-width: 1200px){
  .serched {
    width: 1200px;
  }
}
</style>