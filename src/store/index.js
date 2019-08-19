import Vue from 'vue'
import Vuex from 'vuex'
import AudioWorker from 'worker-loader!@/../static/opus/audio.worker.js'
const slicetext = require('@/components/options/slicetext')

Vue.use(Vuex)

let sendJson = {
    op: '',
    key: '',
}

// const FRAME_SIZE = 960
// const FLUSH_SIZE = FRAME_SIZE * 10
// const FLUSH_PACKET_SIZE = FLUSH_SIZE * 2

let context = new (window.AudioContext || window.webkitAudioContext)()
let GainNode = context.createGain()
GainNode.connect(context.destination)
let session_key

let ws = new WebSocket('wss://sarisia.cc/player/')
const audioWorker = new AudioWorker()
audioWorker.onmessage = (event) => {
    // console.log(event.data)
    queueAudio(event.data)
}
let buf
let leftchannel
let rightchannel
let bufSource
let offset = 0
let playing = 0

function resetAudio() {
    const currentVolume = GainNode.gain.value
    context.close()
    context = new (window.AudioContext || window.webkitAudioContext)()
    GainNode = context.createGain()
    GainNode.gain.value = currentVolume
    GainNode.connect(context.destination)
    playing = 0
    // refreshBuffer()
}

function refreshBuffer(packet_length) {
    // console.log(`packet length ${packet_length}`)
    buf = context.createBuffer(2, packet_length/2, 48000)
    leftchannel = buf.getChannelData(0)
    rightchannel = buf.getChannelData(1)
    bufSource = context.createBufferSource()
    bufSource.buffer = buf
    bufSource.connect(GainNode)
    offset = 0
}

function queueAudio(msg) {
    if (msg.len === 0)
        return

    refreshBuffer(msg.len)
    const decodedF32 = new Float32Array(msg.buf)
    for (let x = 0; x < msg.len; x+=2) {
        leftchannel[offset] = decodedF32[x]
        rightchannel[offset] = decodedF32[x+1]
        offset++
    }

    if (playing < context.currentTime)
        playing = context.currentTime + 0.1

    bufSource.start(playing)
    playing += bufSource.buffer.duration

    // refreshBuffer()
}

ws.onopen = (event) => {
    store.commit('setVolume', localStorage.getItem('volume'))
    // refreshBuffer()
}

ws.onmessage = (event) => {
    const container = JSON.parse(event.data)
    console.log(`[fetch] ${container.type}`)

    switch (container.type) {
        case 'hello':
            session_key = container.key
            sendJson.key = session_key
            audioWorker.postMessage({op: 'connect', key: session_key})
            break

        case 'search':
            store.commit('storeSearchResult', container.data)
            break

        case 'playlists':
            store.commit('storePlaylists', container.data.playlists)
            break

        case 'playlist':
            store.commit('storePlaylistContents', container.data)

        case 'event_queue_change':
            store.commit('changeQueue', container.data.queue)
            break

        case 'event_player_state_change':
            console.log(`[event_player_state_change] ${store.state.nowState} => ${container.data.state}`)
            if (container.data.state === 'stopped') {
                audioWorker.postMessage({op: 'flush'})
            }
            store.commit('changeState', container.data)
            break

        case 'event_playlists_change':
            store.commit('storePlaylists', container.data.playlists)
            break

        case 'event_playlist_entry_change':
            break
        
        default:
            console.log(`Unknown operation!: ${container.type}`)
            break
    }
}

ws.onerror = () => {
    ws = new WebSocket('wss://sarisia.cc/player/')
}

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
        searchContents: localStorage.searchContents ? '' : localStorage.searchContents,
        playingData: { key: "", source: "", title: "", uri: "", thumbnail: "", entry: null },
        nowState: 'stopped',
        queue: [],
        playlists: [],
        forcusedPlaylist: [],
        volume: 100,
    },
    mutations: {
        changeTheme(state, nowTheme) {
            state.theme = nowTheme
        },
        setTheme(state, theme) {
            state.theme = theme
        },
        storeSearchResult(state, result) {
            state.searchedData = result.map((property, index) => {
                property.key = index
                return property
            })
        },
        setSearchContents(state, text) {
            const contents = text.length > 70 ? slicetext(text, 70) : text
            state.searchContents = contents
            localStorage.searchContents = contents
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
            if(result != null){
                state.queue = result.map((property, index) => {
                    property.index = index
                    return property
                })
            }
        },
        storePlaylistContents(state, contents) {
            state.forcusedPlaylist = contents
        },
        setVolume({}, volume){
            GainNode.gain.value = volume / 400
        }
    },
    actions: {
        sendAsSearch({}, text) {
            this.commit('setSearchContents', text)
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
        sendAsQueueWithPlaylist({ }, list) {
            sendToSocket('queue', { playlist: list })
        },
        sendAsQueueToHead({ }, playUri) {
            sendToSocket('queue', { uri: playUri, head: true })
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
        sendAsSkipTo({}, element) {
            sendToSocket('skip_to', { index: element.index, uri: element.uri })
        },
        sendAsEditedQueue({}, newQueue) {
            sendToSocket('edit_queue', { queue: newQueue })
        },
        sendAsShuffle() {
            sendToSocket('shuffle')
        },
        sendAsRemoveFromQueue({}, element) {
            sendToSocket('remove', { uri: element.uri, index: element.index })
        },
        sendAsLike({}, likeUri) {
            sendToSocket('like', { uri: likeUri })
        },
        sendAsPlaylist({}, playlistName) {
            sendToSocket('playlist', { name: playlistName })
        },
        sendAsRemoveFromPlaylist({}, { playlistName: playlistName, removeUri: removeUri }) {
            sendToSocket('remove_from_playlist', { name: playlistName, uri: removeUri })
        },
        sendAsDeletePlaylist({}, listname) {
            sendToSocket('delete_playlist', { name: listname })
        },
        sendAsAddToPlaylist({}, {listname: listname, addedUri: addedUri}) {
            sendToSocket('add_to_playlist', { name: listname, uri: addedUri })
        },
        sendAsRepeat({}, repeatUri) {
            sendToSocket('repeat', { uri: repeatUri })
        },
        sendAsClearQueue() {
            sendToSocket('clear_queue')
        },
        initAudio() {
            resetAudio()
            console.log('audiocontext initialized')
        }
    }
})

export default store
