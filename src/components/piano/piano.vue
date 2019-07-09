<template>
<div id=root>
    <div class=test>
        <p>INPUT KEY: {{ input_key }}</p>
    </div>
    <p class=map v-for="keymap in keymaps" :key=keymap.key>
        {{ keymap.key }} : {{ keymap.s }}
    </p>
</div>
</template>

<script>
export default {
    data: () => ({
        input_key: 'init',
        onSpace: false,
        keymaps: [
            {key: 'A', s: 'ド'},
            {key: 'W', s: 'ド#'},
            {key: 'S', s: 'レ'},
            {key: 'E', s: 'レ#'},
            {key: 'D', s: 'ミ'},
            {key: 'F', s: 'ファ'},
            {key: 'T', s: 'ファ#'},
            {key: 'G', s: 'ソ'},
            {key: 'Y', s: 'ソ#'},
            {key: 'H', s: 'ラ'},
            {key: 'U', s: 'ラ#'},
            {key: 'J', s: 'シ'},
            {key: 'K', s: 'ド'},
            {key: 'Z', s: 'ド'},
            {key: 'X', s: 'レ'},
            {key: 'C', s: 'ミ'},
            {key: 'V', s: 'ファ'},
            {key: 'B', s: 'ソ'},
            {key: 'N', s: 'ラ'},
            {key: 'M', s: 'シ'}
        ]
    }),
    created() {
        window.addEventListener('keydown', (event) => {
            this.piano(this.getPianoFile(event.keyCode))
        }),
        window.addEventListener('keyup', (event) => {
            if(event.keyCode === 32) this.onSpace = false
        })
    },
    methods: {
        piano(file) {
            if(file === 'Unregistered') return ''
            let sound = new Audio(require('@/components/piano/pianosound/' + file))
            sound.volume = 0.05
            sound.playbackRate = this.onSpace ? 0.6 : 1
            sound.play()
        },
        getPianoFile(keycode) {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            let medley = {
                'A':'do', 'W':'do_s',
                'S':'re', 'E':'re_s',
                'D':'mi',
                'F':'fa', 'T':'fa_s',
                'G':'so', 'Y':'so_s',
                'H':'ra', 'U':'ra_s',
                'J':'si',
                'K':'do2',

                'Z':'do2',
                'X':'re2',
                'C':'mi2',
                'V':'fa2',
                'B':'so2',
                'N':'ra2',
                'M':'si2',
            }
            if(keycode === 32) {
                this.onSpace = true
                this.input_key = 'space'
                return ''
            } else if(keycode < 65 || keycode > 90) {
                this.input_key = 'Unregistered'
                return ''
            } else {
                this.input_key = alphabet[keycode - 65]
                return medley[this.input_key] + '.mp3'
            }
        }
    }
}
</script>

<style>
.test {
    height: 80px;
    background-color:crimson;
    font-size: large;
    text-align: center;
}
.map {
    text-align:center;
}
</style>
