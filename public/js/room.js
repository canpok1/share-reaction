let params = {
    socket: null,
    enablePlay: false,
    roomId: ""
};

function init(roomId) {
    params.socket = io();
    params.roomId = roomId;
    params.socket.on("connect", () => {
        console.log("connected");
        join();
    });
    params.socket.on("disconnect", () => {
        console.log("disconnected");
        leave();
    });
    params.socket.on('reaction', (reactionType) => {
        play(reactionType);
    });
}

function join() {
    params.socket.emit("join", params.roomId);
    document.getElementById('clap-button').removeAttribute("disabled");
}

function leave() {
    document.getElementById('clap-button').setAttribute("disabled", true);
}

function setEnable(enable) {
    params.enablePlay = enable;
}

function play(reactionType) {
    if (!params.enablePlay) {
        return;
    }

    const audioPath = "/audio/clap.m4a";
    try {
        const audioCtx = new AudioContext();

        const audioEle = new Audio();
        audioEle.src = audioPath;
        audioEle.autoplay = true;
        audioEle.preload = "auto";
        audioEle.addEventListener("ended", function () {
            audioCtx.close();
        });

        const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

        audioSourceNode.connect(audioCtx.destination);
    } catch (error) {
        console.log("error occured!!! error:" + error);
    }
}

function reaction(reactionType) {
    params.socket.emit("reaction", reactionType);
    play(reactionType);
}
