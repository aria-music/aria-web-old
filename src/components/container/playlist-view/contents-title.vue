<template>
  <v-card class="pa-3" height="100%">
    <v-card
      max-height="350"
      max-width="350"
      class="mx-auto"
      :class="theme ? 'grey lighten-3' : 'grey darken-3'"
    >
      <v-img
        :src="nowSelect.thumbnail == '' ? src : nowSelect.thumbnail "
        contain
        class="img-size"
        :aspect-ratio="1/1"
      ></v-img>
    </v-card>
    <v-card
      class="mt-3 mx-auto width"
    >
      <v-card-title class="playing-title" v-if="showTitle">
          {{ nowSelect.title }}
      </v-card-title>
      <v-card-title class="playing-title" v-else>
          {{ slicedTitle }}
      </v-card-title>
      <v-divider class="mx-3"></v-divider>
      <v-toolbar
          color="transparent"
          flat
      >
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              v-for="item in items"
              :key="item.key"
              icon
              @click="btnFunc(item.key)"
              class="mr-0"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    src: 'https://yt3.ggpht.com/a/AGF-l7_Fe-TsDeIJhiIJeH4UvGNGr9VFOHSJytPgkg=s900-mo-c-c0xffffffff-rj-k-no',
    showTitle: false,
    items: [
      {key: 1, icon: "fab fa-facebook-f"},
      {key: 2, icon: "share"},
      {key: 3, icon: "error_outline"},
    ],
  }),
  props: {
    theme: {type: Boolean, required: true},
    nowSelect: {type: Object, required: true},
  },
  computed: {
    slicedTitle() {
      let isSlice = false
      let title = this.nowSelect.title
      function strLength(strSrc) {
        let len = 0, i;
        strSrc = escape(strSrc)
        for(i = 0; i < strSrc.length; i++, len++){
          if(strSrc.charAt(i) == "%"){
            if(strSrc.charAt(++i) == "u"){
              i += 3
              len++
            }
            i++
          }
        }
        return len
      }

      while( strLength(title) > 38 ){
        title = title.slice(0, title.length-1)
        isSlice = true
      }
      if( isSlice ){
        title += '...'
      }
      return title
    },
  },
  methods: {
    btnFunc(key) {
      switch(key){
        case 1:
          break;
        case 2:
          break;
        case 3:
          this.showTitle = !this.showTitle
          break;
      }
    },
  },
}
</script>
<style>
.width {
  min-width: 250px;
}
@media(min-width: 887px){
  .width{
    width: 350px;
  }
}
.playing-title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 1%;
}
</style>