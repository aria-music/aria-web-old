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

        case 'playlists':
            // store.commit('storePlaylists', container.data)
            break
    }
}

let sendToSocket = (op, data) => {
    let Json = sendJson
    Json.op = op
    Json.data = data
    ws.send(JSON.stringify(Json))
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
        storeSearchResult(state, result) {
            state.searchedData = result.map((property, index) => {
                property.key = index
                return property
            })
        },
        getSearchContents(state, text) {
            state.searchContents = text
        },
        storePlaylists(state, result) {
            state.playlists = result.map((property, index) => {
                property.index = index
                property.kind = 'playlist'
                return property
            })
        }
    },
    actions: {
        sendWithSearch(state, text) {
            this.commit('getSearchContents', text)
            sendToSocket('search', { query: text })
        },
        sendWithPlaylists(state, newName) {
            sendToSocket('create_playlist', { name: newName })
        }
    }
})

export default store
