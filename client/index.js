import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("http://localhost:3000");
const peer = new Peer();
let users = [];
let preeIdClient;

function insertIds(users) {
  let div = document.getElementById("d1");
  div.innerHTML = "";
  users.forEach((e) => {
    div.innerHTML += `user soketId : ${e.soketId} / user peerId <button class="man">${e.preeId}</button> <br>`;
  });

  //##########################################################################################################################

  let buton = document.querySelectorAll(".man");
  buton.forEach((e) => {
    e.addEventListener("click", () => {
      callUser(e.innerHTML);
    });
  });

  //##########################################################################################################################
}

function callUser(preeId) {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      let call = peer.call(preeId, stream);
      call.on("stream", (stream) => {
        videoappend(stream);
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
      call.answer(stream);
      call.on("stream", (stream) => {
        videoappend(stream);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

function videoappend(stream) {
  let video = document.getElementById("v1");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}
