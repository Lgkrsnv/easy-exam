// const socket = window.io("http://localhost:3000/");
const socket = io();

const display = (msg, type) => {
  const msgDiv = document.createElement('div');
  const className = type;
  msgDiv.classList.add(className, 'message-row');
  const times = new Date().toLocaleTimeString();

  const innerText = `
      <div class="message-title">
        🗨️<span>${msg.user}</span>
      </div>
      <div class="message-text">
        ${msg.message}
      </div>
      <div class="message-time">
        ${times}
      </div>
  `;
  msgDiv.innerHTML = innerText;
  displayMsg.appendChild(msgDiv);
};
// const socketConnection = io.connect();
// socketConnection.on('connect', () => {
//   const sessionID = socketConnection.socket.sessionid;
//   console.log(sessionID);
// });


const msgText = document.querySelector('#msg');
const btnSend = document.querySelector('#btn-send');
const chatBox = document.querySelector('.chat-content');
const displayMsg = document.querySelector('.message');

let name;

do {
  name = prompt('Как Вас зовут?')
} while (!name);

document.querySelector('#your-name').textContent = name;
msgText.focus();

btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(socket.id);
  sendMsg(msgText.value);
  msgText.value = '';
  msgText.focus();
  chatBox.scrollTop = chatBox.scrollHeight;
});


const sendMsg = message => {
  let msg = {
    socketId: socket.id,
    user: name,
    message: message.trim(),
  };

  display(msg, 'you-message');
  // socket.emit('join', msg);
  socket.emit('sendFirstMessage', msg);
};

socket.on('sendToAll', msg => {
  display(msg, 'other-message');
  chatBox.scrollTop = chatBox.scrollHeight;
});

