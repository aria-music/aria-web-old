import Vue from 'vue'
import Vuex from 'vuex'
import AudioWorker from 'worker-loader!@/../static/opus/audio.worker.js'

Vue.use(Vuex)

let sendJson = {
    op: '',
    key: '',
}

const FRAME_SIZE = 960
const FLUSH_SIZE = FRAME_SIZE * 25
const FLUSH_PACKET_SIZE = FLUSH_SIZE * 2

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

function refreshBuffer() {
    buf = context.createBuffer(2, FLUSH_SIZE, 48000)
    leftchannel = buf.getChannelData(0)
    rightchannel = buf.getChannelData(1)
    bufSource = context.createBufferSource()
    bufSource.buffer = buf
    bufSource.connect(GainNode)
    offset = 0
}

function queueAudio(msg) {
    const decodedF32 = new Float32Array(msg)
    for (let x = 0; x < FLUSH_PACKET_SIZE; x+=2) {
        leftchannel[offset] = decodedF32[x]
        rightchannel[offset] = decodedF32[x+1]
        offset++
    }

    if (offset === FLUSH_SIZE) {
        if (playing < context.currentTime)
            playing = context.currentTime + 1.00

        bufSource.start(playing)
        playing += bufSource.buffer.duration
        // console.log(bufSource.buffer.duration)

        refreshBuffer()
    }
}

ws.onopen = (event) => {
    store.commit('setVolume', localStorage.getItem('volume'))
    refreshBuffer()
}

ws.onmessage = (event) => {
    const container = JSON.parse(event.data)
    switch (container.type) {
        case 'hello':
            console.log('$fetch hello')
            session_key = container.key
            sendJson.key = session_key
            audioWorker.postMessage(session_key)
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

// function playAudio(decoded_array) {
//     let AudioBuffer = context.createBuffer(2, decoded_array.length/2, 48000)
//     let audioSource = context.createBufferSource()

//     let leftpacket = decoded_array.filter((t, index, a) => !(index % 2))
//     let rightpacket = decoded_array.filter((t, index, a) => index % 2)

//     AudioBuffer.getChannelData(0).set(leftpacket)
//     AudioBuffer.getChannelData(1).set(rightpacket)
//     audioSource.buffer = decoded
//     audioSource.connect(GainNode)
//     GainNode.connect(context.destination)

//     console.log(AudioBuffer.duration)
//     if (context.currentTime < playing) {
//         audioSource.start(playing)
//         playing += AudioBuffer.duration
//     } else {
//         audioSource.start(context.currentTime)
//         playing = context.currentTime + AudioBuffer.duration
//     }
// }

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
        setTheme(state, theme) {
            state.theme = theme
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
            if(result.queue != null){
                state.queue = result.queue.map((property, index) => {
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
        sendAsQueueWithPlaylist({ }, list) {
            sendToSocket('queue', { playlist: list })
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
            sendToSocket('add_to_playlist', { name: listname, uri: addedUri})
        },
        sendAsRepeat({}, repeatUri) {
            sendToSocket('repeat', { uri: repeatUri})
        },
        sendAsClearQueue() {
            sendToSocket('clear_queue')
        }
    }
})

export default store
