import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/// debug ///
const newData = require("./queue-sample.json")
const lists = require("./playlist-sample.json")
//

const store = new Vuex.Store({
    state: {
        theme: false,
        searchedData: newData.map((property, index) => {
            property.key = index
            return property
        }),
        playingData: { source: "", title: "", uri: "", thumbnail: "", entry: null },
        queue: newData.map((property, index) => {
            property.key = index
            return property
        }),
        playlists: lists.map((property, index) => {
            property.index = index
            property.kind = 'playlist'
            return property
        })
    },
    getters: {
        //
    },
    mutations: {
        changeTheme(state, nowTheme) {
            state.theme = nowTheme
        },
        nowPlaying(state, selectedElement) {
            state.playingData = selectedElement
        },
        setQueue(state, queue) {
            state.queue = queue
        },
        addPlaylist(state, newName) {
            let length = state.playlists.length
            state.playlists.push({
                name: newName,
                img: '',
                index: length,
                kind: 'playlist'
            })
        }
    },
    actions: {
        //
    }
})

export default store
