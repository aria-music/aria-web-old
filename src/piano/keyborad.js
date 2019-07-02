let medley = {'A':'do', 'W':'do_s',
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
             };
var onSpaceKey = false;

document.onkeydown = function(e) {
    let sound = new Audio();
    let k = getkey(e.keyCode);
    log = document.getElementById('keyboard-msg');
    log.innerHTML = 'key: ' + k;
    console.log(k + " key down");
    if(k === 'SPACE') {
        onSpaceKey = true;
    } else if(medley[k]) {
        sound.src = 'pianosound/' + medley[k] + '.mp3';
        sound.playbackRate = onSpaceKey ? 0.6 : 1;
        sound.play();
    } else {
        log.innerHTML += ' could not use';
    }
}
document.onkeyup = function(e) {
    if(getkey(e.keyCode) === 'SPACE'){
        console.log("space key up");
        onSpaceKey = false;
    }
}
function getkey(keyid) {
    if(keyid === 32) return 'SPACE';
    if(keyid < 65 || keyid > 90) return 'KEY';

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet[keyid - 65];
}

