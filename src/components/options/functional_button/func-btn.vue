<template>
  <v-menu
    v-model="isOpen"
    bottom
    origin="center center"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon small>fas fa-ellipsis-v</v-icon>
      </v-btn>
    </template>
    <v-list class="py-0">
      <v-list-tile
        v-for="(item, index) in items"
        :key="index"
        @click="menuFunctions(item.content)"
        class="sub-menu"
      >
        <v-list-tile-title>
          <div style="font-size: 14px">
            <v-icon>{{ item.icon }}</v-icon>
            <span class="ml-2">{{ item.text }}</span>
          </div>
        </v-list-tile-title>
      </v-list-tile>
      <playlistDialog
        :showDialog="isShow"
        :songUri="url"
      />
    </v-list>
  </v-menu>
</template>
<script>
import playlistDialog from "@/components/options/playlist-dialog"
import toast from '@/components/options/toaster/toastCore'
const slicetext = require('@/components/options/slicetext')

const useableItems = [
  { content: 'like', text: 'Like',  icon: 'fas fa-heart' },
  { content: 'addList', text: 'Add to Playlist', icon: 'fas fa-plus' },
  { content: 'removeQueue', text: 'Remove', icon: 'far fa-trash-alt' },
  { content: 'playnext', text: 'Play Next', icon: 'fas fa-play-circle' },
  { content: 'playnow', text: 'Play Now', icon: 'far fa-play-circle' },
  { content: 'removeList', text: 'Remove', icon: 'far fa-trash-alt' },
]

export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    funcs: {
      type: Array,
      required: true
    },
    playlistName: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isOpen: false,
    isShow: false,
    url: '',
  }),
  computed: {
    items() {
      return useableItems.filter(value => {
        return this.funcs.indexOf(value.content) !== -1
      })
    }
  },
  methods: {
    menuFunctions(content) {
      switch(content){
        case 'like':
          this.like(this.element.uri)
          break
        case 'addList':
          this.addList(this.element.uri)
          break
        case 'removeQueue':
          this.removeFromQueue(this.element)
          break
        case 'playnext':
          this.playnext(this.element)
          break
        case 'playnow':
          this.playnow(this.element)
          break
        case 'removeList':
          if(this.playlistName) this.removeFromPlaylist(this.playlistName, this.element.uri)
          else throw new Error()
          break
      }
    },
    like(uri) {
      this.$store.dispatch('sendAsLike', uri)
    },
    addList(url) {
      this.url = url
      this.isOpen = false
      this.isShow = !this.isShow
    },
    removeFromQueue(element) {
      this.$store.dispatch('sendAsRemoveFromQueue', element)
    },
    playnext(element) {
      this.$store.dispatch('sendAsQueueToHead', element.uri)
      this.toaster(element.title)
    },
    playnow(element) {
      this.$store.dispatch('sendAsPlay', element.uri)
      this.toaster(element.title)
    },
    removeFromPlaylist(name, uri) {
      this.$store.dispatch('sendAsRemoveFromPlaylist', { playlistName: name, removeUri: uri })
      this.$store.dispatch('sendAsPlaylist', name)
    },
    toaster(title) {
      const slicedTitle = title.length > 22 ? slicetext(title, 22) : title
      toast(slicedTitle)
    }
  },
  components: {
    playlistDialog,
  },
}
</script>
<style>
.sub-menu:hover {
  background-color: rgb(175, 175, 175);
}
</style>
