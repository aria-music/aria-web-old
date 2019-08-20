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
              <v-img
                :src="ariaVersion"
                contain
              >
              </v-img>
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
                  @click="initAudioContext"
                ><v-icon>refresh</v-icon>
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
import toast from '@/components/options/toaster/toastCore'
import {version} from "@/../static/VERSION.json"

export default {
  name: 'ariaHeader',
  data: () => ({
    verPath: 'static/VERSION.json',
    text: "",
    canMessageSend: false,
  }),
  computed: {
    ariaVersion() {
      return `https://img.shields.io/badge/version-${version}-ff4081?link=https%3A%2F%2Fgithub.com%2Faria-music%2Faria-web&style=for-the-badge&logo=github`
    }
  },
  props: {
    width: {type: Number, required: true}
  },
  components: {
    toast,
  },
  methods: {
    goPlaylist() {
      this.$router.push('/')
    },
    sendWithSearch() {
      if(this.canMessageSend){
        this.canMessageSend = false
        this.$store.dispatch('sendAsSearch', this.text)
        this.text = ""
        this.$router.push('/search')
      }else return
    },
    initAudioContext() {
      this.$store.dispatch('initAudio')
      toast('Audio Reloaded!')
    },
  }
}
</script>
