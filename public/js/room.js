let enablePlay = false;

let socket = io();
socket.on("connect", () => {
    console.log("connected");
});
socket.on("disconnect", () => {
    console.log("disconnected");
    leave();
});
socket.on('reaction', (reactionType) => {
    play(reactionType);
});

function join(roomId) {
    socket.emit("join", roomId);
    document.getElementById('join-button').setAttribute("disabled", true);
    document.getElementById('clap-button').removeAttribute("disabled");
}

function leave() {
    document.getElementById('join-button').removeAttribute("disabled");
    document.getElementById('clap-button').setAttribute("disabled", true);
}

function setEnable(enable) {
    enablePlay = enable;
}

function play(reactionType) {
    if (!enablePlay) {
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
    socket.emit("reaction", reactionType);
    play(reactionType);
}
