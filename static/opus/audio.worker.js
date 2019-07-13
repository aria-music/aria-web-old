import opusModule from './opus.js'

let rawU8
let decodedF32
let ready = false
const opus = opusModule({
    onRuntimeInitialized: function() {
        opus.ccall('init', 'number')
        const encodePtr = opus.ccall('encode_buf', 'number')
        const decodePtr = opus.ccall('decode_buf', 'number')
        rawU8 = new Uint8Array(opus.HEAPU8.buffer, encodePtr)
        decodedF32 = new Float32Array(opus.HEAPF32.buffer, decodePtr)
        ready = true
    }
})
console.log(opus)

function queueAudio(packet) {
    rawU8.set(new Uint8Array(packet))
    const frames = opus.ccall('decode', 'number', ['number'], [packet.byteLength])
    // console.log(frames)
    postMessage(decodedF32)
}

let ws

onmessage = (event) => {
    ws = new WebSocket("wss://sarisia.cc./stream/")
    ws.binaryType ="arraybuffer"
    ws.onopen = () => {
        ws.send(event.data)
        console.log("connected")
    }
    ws.onmessage = (packet) => {
        if (ready)
            queueAudio(packet.data)
    }
}