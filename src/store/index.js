import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/// debug ///
const newData = require("./queue-sample.json")
const lists = require("./playlist-sample.json")
//
let sendJson = {
    op: '',
    key: '',
    data: null
}

var ws = new WebSocket('wss://sarisia.cc/aria/player')

ws.onmessage = (event) => {
    const container = JSON.parse(event.data)
    switch (container.res) {
        case 'hello':
            sendJson.key = container.key
            break

        case 'search':
            store.commit('storeSearchResult', container.data)
            break
    }
}

const store = new Vuex.Store({
    state: {
        theme: false,
        searchedData: null,
        searchContents: "",
        playingData: { key: "", source: "", title: "", uri: "", thumbnail: "", entry: null },
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
        },
        storeSearchResult(state, result) {
            state.searchedData = result.map((property, index) => {
                property.key = index
                return property
            })
        },
        getSearchContents(state, text) {
            state.searchContents = text
        }
    },
    actions: {
        sendWithSearch(state, text) {
            this.commit('getSearchContents', text)
            sendJson.op = 'search'
            sendJson.data = {query: text}
            ws.send(JSON.stringify(sendJson))
        }
    }
})

export default store
