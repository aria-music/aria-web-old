import opusModule from './opus.js'


const FRAME_SIZE = 960
const FLUSH_SIZE = FRAME_SIZE * 25
const FLUSH_PACKET_SIZE = FLUSH_SIZE * 2

let buf = new Float32Array(48000)
let count = 0

let rawU8
let decodedF32
let ready = false
const opus = opusModule({
    onRuntimeInitialized: function() {
        opus.ccall('init', 'number')
        const encodePtr = opus.ccall('encode_buf', 'number')
        const decodePtr = opus.ccall('decode_buf', 'number')
        console.log(decodePtr)
        rawU8 = new Uint8Array(opus.HEAPU8.buffer, encodePtr)
        decodedF32 = new Float32Array(opus.HEAPF32.buffer, decodePtr)
        ready = true
    }
})
console.log(opus)

function flushBuffer() {
    postMessage(buf.buffer, [buf.buffer])
    buf = new Float32Array(48000)
    count = 0
}

function queueAudio(packet) {
    rawU8.set(new Uint8Array(packet))
    const frames = opus.ccall('decode', 'number', ['number'], [packet.byteLength])
    // console.log(frames)
    // postMessage(decodedF32.buffer, [decodedF32.buffer])
    for (let x = 0; x < FRAME_SIZE*2; ++x) {
        buf[count++] = decodedF32[x]
    }

    // console.log(count)
    if (count === FLUSH_PACKET_SIZE)
        flushBuffer()
}

let ws

onmessage = (event) => {
    ws = new WebSocket("wss://sarisia.cc/stream/")
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