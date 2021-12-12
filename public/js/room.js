let params = {
    socket: null,
    mute: false,
    volume: 0,
    roomId: '',
    playingCount: 0,
};

const AUDIOS = {
    clap: [
        '/audio/clap_1.mp3',
        '/audio/clap_2.mp3',
        '/audio/clap_3.mp3',
    ]
};

const VOLUME_MAX = 100;
const VOLUME_MIN = 0;
const PLAYING_COUNT_MAX = 30;

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
        setHeatmapActiveRandom();
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
    if (!(reactionType in AUDIOS)) {
        console.log(`reactionType:${reactionType} is not supported`);
        return;
    }
    if (params.playingCount > PLAYING_COUNT_MAX) {
        console.log(`skip play [playingCount:${params.playingCount}]`);
        return;
    }
    params.playingCount++;

    const audios = AUDIOS[reactionType];

    const audioCtx = new AudioContext();

    const audioEle = new Audio();
    audioEle.src = audios[Math.floor(Math.random() * audios.length)];
    audioEle.autoplay = true;
    audioEle.preload = 'auto';
    audioEle.addEventListener('ended', function () {
        audioCtx.close();
        params.playingCount--;
    });
    const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = params.volume / VOLUME_MAX;

    audioSourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination)
}

function reaction(reactionType) {
    params.socket.emit('reaction', reactionType);
    play(reactionType);
    setHeatmapActiveRandom();
}

function copyUrl() {
    navigator.clipboard.writeText(location.href);
}

function setHeatmapActiveRandom() {
    let cells = Array.from(document.getElementsByClassName('heatmap-cell inactive'));
    if (cells.length == 0) {
        return;
    }

    const index = Math.floor(Math.random() * cells.length);
    const cell = cells[index];
    cell.classList.add('active');
    cell.classList.remove('inactive');

    setTimeout(() => {
        cell.classList.remove('active');
        cell.classList.add('inactive');
    }, 4000);
}