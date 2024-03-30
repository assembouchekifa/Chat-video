import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("/");
const peer = new Peer(undefined, { host: "/", port: 3001 });
let users = [];
let preeIdClient;
const gridVid = document.getElementById("cont");
const inp = document.getElementById("name");
let inrom = false;
let call;

inp.addEventListener("change", (e) => {
  console.log(inp.value);
  socket.emit("namechang", inp.value);
});

function insertIds(users) {
  let div = document.getElementById("divusers");
  if (!inrom) {
    div.innerHTML =
      'users online is <sub style="font-size: x-small" >click to call</sub> : ';
    users.forEach((e) => {
      if (e.incall) {
        div.innerHTML += `<button class="user incall" data-peerId="${e.preeId}" >${e.name}</button>`;
        return;
      }
      div.innerHTML += `<button class="user" data-peerId="${e.preeId}" >${e.name}</button>`;
    });
    let buton = document.querySelectorAll(".user");
    buton.forEach((e) => {
      e.addEventListener("click", () => {
        callUser(e.dataset.peerid);
      });
    });
    return;
  }
  div.innerHTML = '<button id="cloas" class="close" >call end</button>';
  let boutton = document.getElementById("cloas");
  boutton.addEventListener("click", () => {
    close();
  });
}

function close() {
  call.close();
  socket.emit("incallnow", false);
  inrom = false;
}

function callUser(preeId) {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      call = peer.call(preeId, stream);
      let vid = document.createElement("video");
      call.on("stream", (stream) => {
        videoappend(vid, stream);
      });
      call.on("close", () => {
        socket.emit("incallnow", false);
        inrom = false;
        vid.remove();
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

peer.on("open", function (id) {
  console.log("My peer ID is: " + id);
  preeIdClient = id;
  socket.emit("sendPeerId", id);
});

socket.on("userchang", (data) => {
  users = data;
  for (let i = 0; i < users.length; i++) {
    if (users[i].preeId == preeIdClient) {
      users.splice(i, 1);
    }
  }
  insertIds(users);
});

peer.on("call", (call1) => {
  call = call1;
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      let vid = document.createElement("video");
      if (!inrom) {
        call1.answer(stream);
      }
      call1.on("stream", (stream) => {
        videoappend(vid, stream);
      });
      call1.on("close", () => {
        inrom = false;
        socket.emit("incallnow", false);
        vid.remove();
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

function videoappend(video, stream) {
  inrom = true;
  socket.emit("incallnow", true);
  video.classList.add("video");
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
  };
  gridVid.appendChild(video);
}

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    let vid = document.getElementById("myV");
    vid.srcObject = stream;
    vid.onloadedmetadata = () => {
      vid.play();
    };
  })
  .catch((error) => {
    console.log(error);
  });
