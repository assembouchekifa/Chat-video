import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("/");
const peer = new Peer();
let users = [];
let preeIdClient;
const gridVid = document.getElementById("cont");
const inp = document.getElementById("name");

inp.addEventListener("change", (e) => {
  console.log(inp.value);
  socket.emit("namechang", inp.value);
});

function insertIds(users) {
  let div = document.getElementById("divusers");
  div.innerHTML =
    'users online is <sub style="font-size: x-small" >click to call</sub> : ';
  users.forEach((e) => {
    div.innerHTML += `<button class="user" data-peerId="${e.preeId}" >${e.name}</button>`;
  });

  let buton = document.querySelectorAll(".user");
  buton.forEach((e) => {
    e.addEventListener("click", () => {
      callUser(e.dataset.peerid);
    });
  });
}

function callUser(preeId) {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      let call = peer.call(preeId, stream);
      let vid = document.createElement("video");
      call.on("stream", (stream) => {
        videoappend(vid, stream);
      });
      call.on("close", () => {
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

peer.on("call", (call) => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      let vid = document.createElement("video");
      call.answer(stream);
      call.on("stream", (stream) => {
        videoappend(vid, stream);
      });
      call.on("close", () => {
        vid.remove();
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

function videoappend(video, stream) {
  video.classList.add("video");
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
  };
  gridVid.appendChild(video);
}

// navigator.mediaDevices
//   .getUserMedia({
//     audio: true,
//     video: true,
//   })
//   .then((stream) => {
//     videoappend(stream);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
