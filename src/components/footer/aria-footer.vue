<template>
    <v-footer
		fixed
		height="65"
	>
    <v-layout column>
      <v-flex>
        <v-progress-linear
          :value="nowTime"
          class="my-0 py-0"
          height="5"
          background-color="pink lighten-4"
          color="pink lighten-1"
        ></v-progress-linear>
      </v-flex>
      <v-flex>
        <v-toolbar>
          <div class="mx-auto" :style="{width: `${width}px`}">
            <v-layout row>
              <v-flex xs6>
                <v-toolbar-items>
                  <!-- volume btn -->
                  <v-menu
                    :close-on-content-click="false"
                    open-on-hover
                    top
                    offset-y
                    open-delay="200"
                    ><template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                        @click="mute"
                      ><v-icon>{{ volumeIcon }}</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <v-icon>{{ volumeIcon }}</v-icon>
                        <span><strong>Volume</strong></span>
                      </v-card-title>
                      <v-layout>
                        <v-flex mx-3>
                          <v-slider
                            v-model="volume"
                            color="pink lighten-3"
                            thumb-label
                            :thumb-size="26"
                          ></v-slider>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-menu>
                  <!-- play, skip, shuffle btn-->
                  <v-btn
                    icon
                    v-for="icon in leftIcons"
                    :key="icon.key"
                    @click="func(icon.key)"
                    class="mr-2"
                  ><v-icon>{{ icon.kind }}</v-icon>
                  </v-btn>
                  <!-- repeat btn -->
                  <v-btn
                    icon
                    @click="repeat"
                  ><v-icon :disabled="!repeatCount">{{ repeatIcon }}</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs4>
                <v-toolbar-items>
                  <!-- marquee text -->
                  <v-layout align-center v-show="!$vuetify.breakpoint.xs">
                    <v-flex class="marquee-title">
                      <div>{{ title }}</div>
                    </v-flex>
                  </v-layout>
                  <!-- love btn -->
                  <v-btn
                    icon
                    flat
                    @click="isFavorite = !isFavorite"
                    :color="isFavorite ? 'pink lighten-3' : ''"
                    ><v-icon v-if="isFavorite" color="pink darken-1">favorite</v-icon>
                    <v-icon v-else>favorite_border</v-icon>
                  </v-btn>
                  <!-- menu btn -->
                  <v-menu
                    v-model="isClose"
                    :close-on-content-click="false"
                    top
                    offset-y
                    origin="bottom right"
                    transition="scale-transition"
                    ><template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                        @click="mute"
                        class="mr-3"
                      ><v-icon>playlist_play</v-icon>
                      </v-btn>
                    </template>
                    <v-card
                      height="500"
                      width="300">
                      <v-card-title>
                        <strong class="ml-2" style="font-size: 22px">Playlist</strong>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          @click="isClose = false"
                        ><v-icon>clear</v-icon>
                        </v-btn>
                      </v-card-title>
                    </v-card>
                  </v-menu>
                  <!-- theme btn -->
                  <v-switch
                    v-model="theme"
                    hide-details
                    color="grey darken-1"
                    class="mt-2"
                  ></v-switch>
                </v-toolbar-items>
              </v-flex>
            </v-layout>
          </div>
        </v-toolbar>
      </v-flex>
    </v-layout>
  </v-footer>
</template>
<script>
export default {
  name: 'ariaFooter',
	data: () => ({
		nowTime: 0,
		interval: 0,
		theme: false,
		leftIcons: [
			{ key: 1, kind: 'play_arrow'},
			{ key: 2, kind: 'skip_next'},
			{ key: 3, kind: 'shuffle'},
		],
		rightIcons: [
			{ key: 6, kind: 'favorite'},
			{ key: 7, kind: 'playlist_play'},
		],
		title: "水瀬いのり「Catch the Rainbow！」MUSIC VIDEO",
		volume: 100,
		volumeBuff: 100,
		volumeIcon: 'volume_up',
		repeatCount: 0,
		repeatIcon: 'repeat',
		isFavorite: false,
		isClose: false,
	}),
  props: {
    width: {type: Number, required: true}
  },
	mounted() {
		this.startProgress()
	},
	beforeDestroy () {
		clearInterval(this.interval)
	},
	watch: {
		theme: function(nowTheme) {
			this.$store.commit('changeTheme', nowTheme)
		},
		volume: function() {
			if(this.volume >= 50) this.volumeIcon = "volume_up"
			else if(this.volume == 0) this.volumeIcon = "volume_off"
			else this.volumeIcon = "volume_down"
		},
	},
	methods: {
		startProgress() {
			this.interval = setInterval(() => {
				if(this.nowTime > 100) this.nowTime = 0
				else this.nowTime += 0.05
			}, 100)
		},
		mute() {
			if(this.volume > 0){
				this.volumeBuff = this.volume
				this.volume = 0
			}else this.volume = this.volumeBuff

		},
		func(key) {
			switch(key){
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
			}
		},
		repeat() {
			this.repeatCount++
			if(this.repeatCount == 2) this.repeatIcon = 'repeat_one'
			else if(this.repeatCount == 3){
				this.repeatCount = 0
				this.repeatIcon = 'repeat'
			}
		}

	},
}
</script>
<style>
.marquee-title {
	width: 200px;
	overflow: hidden;
}
.marquee-title div {
	float: left;
	white-space: nowrap;
	animation-name: marquee;
	animation-duration: 15s;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
}
@keyframes marquee {
	from { transform:translateX(0); }
	99%,to { transform:translateX(-100%); }
}
</style>

