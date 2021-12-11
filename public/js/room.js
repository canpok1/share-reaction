let params = {
    socket: null,
    mute: false,
    volume: 0,
    roomId: ''
};

const audios = {
    clap: '/audio/clap.m4a'
};

const VOLUME_MAX = 100;
const VOLUME_MIN = 0;

function init(roomId) {
    params.socket = io();
    params.roomId = roomId;
    params.socket.on('connect', () => {
        console.log('connected');
        join();
    });
    params.socket.on('disconnect', () => {
        console.log('disconnected');
        leave();
    });
    params.socket.on('reaction', (reactionType) => {
        play(reactionType);
    });
}

function join() {
    params.socket.emit('join', params.roomId);
    document.getElementById('clap-button').disabled = false;
}

function leave() {
    document.getElementById('clap-button').disabled = true;
}

function setMute(mute) {
    params.mute = mute;
}

function setVolume(volume) {
    if (volume > VOLUME_MAX) {
        params.volume = VOLUME_MAX;
    } else if (volume < VOLUME_MIN) {
        params.volume = VOLUME_MIN;
    } else {
        params.volume = volume;
    }
    console.log(`volume: ${params.volume}`);
}

function play(reactionType) {
    if (params.mute) {
        return;
    }

    try {
        const audioCtx = new AudioContext();

        const audioEle = new Audio();
        audioEle.src = audios[reactionType];
        audioEle.autoplay = true;
        audioEle.preload = 'auto';
        audioEle.addEventListener('ended', function () {
            audioCtx.close();
        });
        const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = params.volume / VOLUME_MAX;

        audioSourceNode.connect(gainNode);
        gainNode.connect(audioCtx.destination)

    } catch (error) {
        console.log('error occured!!! error:' + error);
    }
}

function reaction(reactionType) {
    params.socket.emit('reaction', reactionType);
    play(reactionType);
}