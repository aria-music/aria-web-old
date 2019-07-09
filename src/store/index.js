import Vue from 'vue'
import Vuex from 'vuex'
import OpusToPCM from 'opus-to-pcm'

Vue.use(Vuex)

/// debug ///
const newData = require("./queue-sample.json")
const lists = require("./playlist-sample.json")
//
let sendJson = {
    op: '',
    key: '',
}

const decoder = new OpusToPCM({ channels: 2 })
let context = new AudioContext()
let GainNode = context.createGain()
let playing = 0.0
let session_key

let ws = new WebSocket('wss://sarisia.cc/player/')
let audio = null

ws.onopen = (event) => {
    store.commit('setVolume', localStorage.getItem('volume'))
    audio = new WebSocket('wss://sarisia.cc/stream/')
    audio.binaryType = "arraybuffer"
    audio.onopen = (event) => {
        audio.send(session_key)
    }
    audio.onmessage = (event) => {
        const raw = new Uint8Array(event.data)
        decoder.decode(raw)
    }
}

ws.onmessage = (event) => {
    const container = JSON.parse(event.data)
    switch (container.type) {
        case 'hello':
            console.log('$fetch hello')
            session_key = container.key
            sendJson.key = session_key
            break

        case 'search':
            console.log('$fetch type = search')
            store.commit('storeSearchResult', container.data)
            break

        case 'playlists':
            console.log('$fetch type = playlists')
            store.commit('storePlaylists', container.data.playlists)
            break

        case 'playlist':
            console.log('$fetch type = playlist')
            store.commit('storePlaylistContents', container.data)

        case 'event_queue_change':
            console.log('$fetch type = event_queue_change')
            store.commit('changeQueue', container.data)
            break

        case 'event_player_state_change':
            console.log('$fetch type = event_player_state_change')
            store.commit('changeState', container.data)
            break

        case 'event_playlists_change':
            console.log('$fetch type = event_playlists_change')
            store.commit('storePlaylists', container.data.playlists)
            break

        case 'event_playlist_entry_change':
            console.log('$fetch type = event_playlist_entry_change')
            break
    }
}

ws.onerror = () => {
    ws = new WebSocket('wss://sarisia.cc/player/')
}

decoder.on('decode', (decoded) => {
    let audioSource = context.createBufferSource()
    audioSource.buffer = decoded
    audioSource.connect(GainNode)
    GainNode.connect(context.destination)

    console.log(AudioBuffer.duration)
    if (context.currentTime < playing) {
        audioSource.start(playing)
        playing += AudioBuffer.duration
    } else {
        audioSource.start(context.currentTime)
        playing = context.currentTime + AudioBuffer.duration
    }
})

let sendToSocket = (op, data) => {
    let Json = Object.assign({}, sendJson)
    Json.op = op
    if(data) Json.data = data
    ws.send(JSON.stringify(Json))
    console.log('$send op = ' + op)
}

const store = new Vuex.Store({
    state: {
        theme: false,
        searchedData: null,
        searchContents: "",
        playingData: { key: "", source: "", title: "", uri: "", thumbnail: "", entry: null },
        nowState: 'stopped',
        queue: [],
        playlists: [],
        forcusedPlaylist: [],
        volume: 0,
    },
    getters: {
        //
    },
    mutations: {
        changeTheme(state, nowTheme) {
            state.theme = nowTheme
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
        },
        changeState(state, result) {
            if(result.entry != null) state.playingData = result.entry
            state.nowState = result.state
        },
        changeQueue(state, result) {
            state.queue = result.queue.map((property, index) => {
                property.index = index
                return property
            })
        },
        storePlaylistContents(state, contents) {
            state.forcusedPlaylist = contents
        },
        setVolume({}, volume){
            GainNode.gain.value = volume / 200
        }
    },
    actions: {
        changeVolume({state}, nowVolume) {
            state.volume = nowVolume
            localStorage.setItem('volume', nowVolume)
        },
        sendAsSearch({}, text) {
            this.commit('getSearchContents', text)
            sendToSocket('search', { query: text })
        },
        sendAsNewplaylist({}, newName) {
            sendToSocket('create_playlist', { name: newName })
        },
        sendAsPlay({}, playUri) {
            sendToSocket('play', { uri: playUri })
        },
        sendAsPlayWithPlaylist({}, list) {
            sendToSocket('play', { playlist: list })
        },
        sendAsQueue({}, playUri) {
            sendToSocket('queue', { uri: playUri })
        },
        sendAsQueueToHead({ }, playUri) {
            sendToSocket('queue', { uri: playUri, head: true})
        },
        sendAsPause() {
            sendToSocket('pause')
        },
        sendAsResume() {
            sendToSocket('resume')
        },
        fetchPlaylists() {
            sendToSocket('playlists')
        },
        sendAsSkip() {
            sendToSocket('skip')
        },
        sendAsEditedQueue({}, newQueue) {
            sendToSocket('edit_queue', { queue: newQueue })
        },
        sendAsShuffle() {
            sendToSocket('shuffle')
        },
        sendAsRemoveFromQueue({}, element) {
            sendToSocket('remove', { uri: element.uri, index: element.index})
        },
        sendAsLike({state}) {
            sendToSocket('like', { uri: state.playingData.uri })
        },
        sendAsPlaylist({}, playlistName) {
            sendToSocket('playlist', { name: playlistName})
        },
        sendAsRemoveFromPlaylist({ }, { playlistName: playlistName, removeUri: removeUri }){
            console.log(removeUri)
            sendToSocket('remove_from_playlist', { name: playlistName, uri: removeUri })
        }
    }
})

export default store
