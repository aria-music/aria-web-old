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
              <v-flex>
                <v-toolbar-items>
                  <!-- volume btn -->
                  <div
                    @mouseenter="hover = true"
                    @mouseleave="hover = false"
                  >
                    <v-layout row align-center justify-center>
                      <v-flex>
                        <v-btn
                          icon
                          @click="mute"
                        ><v-icon>{{ volumeIcon }}</v-icon>
                        </v-btn>
                      </v-flex>
                      <transition name="volume" tag="v-flex" class="pr-3">
                        <v-slider
                          v-if="hover"
                          v-model="volume"
                          style="width: 75px"
                          class="ml-1 mt-1 pt-3"
                          color="pink lighten-3"
                        ></v-slider>
                      </transition>
                    </v-layout>
                  </div>
                  <!-- play btn-->
                  <v-btn
                    icon
                    @click="playOrPause(nowState)"
                    class="mr-2"
                  ><v-icon>{{ nowState == 'paused' ? 'play_arrow' : 'pause' }}</v-icon>
                  </v-btn>
                  <!-- skip btn  -->
                  <v-btn
                    icon
                    @click="skip"
                    class="mr-2"
                  ><v-icon>skip_next</v-icon>
                  </v-btn>
                  <!-- shuffle btn -->
                  <v-btn
                    icon
                    @click="shuffle"
                    class="mr-2"
                  ><v-icon>shuffle</v-icon>
                  </v-btn>
                  <!-- repeat btn -->
                  <v-btn
                    icon
                    @click="repeat"
                  ><v-icon :disabled="!repeatCount">{{ repeatIcon }}</v-icon>
                  </v-btn>
                  <v-spacer @click="goPlay"></v-spacer>
                  <!-- marquee text-->
                  <div class="marquee-title my-auto">
                    <div>{{ nowplayingTitle }}</div>
                  </div>
                  <!-- love btn -->
                  <v-btn
                    icon
                    flat
                    @click="like"
                    :color="nowPlayingData.is_liked ? 'pink lighten-3' : ''"
                    ><v-icon v-if="nowPlayingData.is_liked" color="pink darken-1">favorite</v-icon>
                    <v-icon v-else>favorite_border</v-icon>
                  </v-btn>
                  <!-- menu btn -->
                  <subQueue/>
                  <!-- theme btn -->
                  <div style="width: 40px"  class="my-auto pb-1">
                    <v-switch
                      v-model="theme"
                      hide-details
                      color="grey darken-1"
                    ></v-switch>
                  </div>
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
import subQueue from './sub-queue-list'

export default {
  name: 'ariaFooter',
	data: () => ({
		nowTime: 0,
		interval: 0,
		theme: false,
    hover: false,
		rightIcons: [
			{ key: 6, kind: 'favorite'},
			{ key: 7, kind: 'playlist_play'},
		],
		volume: localStorage.getItem('volume'),
		volumeBuff: 100,
		volumeIcon: 'volume_up',
		repeatCount: 0,
		repeatIcon: 'repeat',
	}),
  computed: {
    nowState() {
      return this.$store.state.nowState
    },
    nowPlayingData() {
      return this.$store.state.playingData
    },
    nowplayingTitle() {
      const data = this.nowPlayingData
      switch(data.source){
        case 'gpm':
          return data.entry.title
        case 'youtube':
          return data.title
      }
    },
  },
  components: {
    subQueue,
  },
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
      this.$store.dispatch('changeVolume', this.volume)
		},
    isPlay: function(newstate) {
      if(newstate) this.$store.dispatch('sendAsResume')
      else this.$store.dispatch('sendAsPause')
    }
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
		repeat() {
			this.repeatCount++
			if(this.repeatCount == 2) this.repeatIcon = 'repeat_one'
			else if(this.repeatCount == 3){
				this.repeatCount = 0
				this.repeatIcon = 'repeat'
			}
		},
    skip() {
      this.$store.dispatch('sendAsSkip')
    },
    playOrPause(nowState) {
      if(nowState == 'paused') this.$store.dispatch('sendAsResume')
      else this.$store.dispatch('sendAsPause')
    },
    shuffle() {
      this.$store.dispatch('sendAsShuffle')
    },
    goPlay() {
      this.$router.push('/play')
    },
    like() {
      this.$store.dispatch('sendAsLike')
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
	animation-timing-function: ease-in;
	animation-iteration-count: infinite;
}
@keyframes marquee {
	from { transform:translateX(0); }
	99%,to { transform:translateX(-100%); }
}
.volume-enter-active, .volume-leave-active {
  transition: .5s ease-in-out;
}
.volume-enter, .volume-leave-to {
  opacity: 0;
}
.volume-leave, .volume-enter-to {
  opacity: 1;
}
.sub-queue-list {
  position: relative;
  height: 430px;
  width: 100%;
}
</style>
