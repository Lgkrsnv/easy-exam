// const socket = window.io('http://localhost:3000/');
const socket = io();

const msgText = document.querySelector('#msg');
const btnSend = document.querySelector('#btn-send');
const chatBox = document.querySelector('.chat-content');
const displayMsg = document.querySelector('.message');
const input = document.querySelector('.msg-tex');

let username;
const room = 'Админка';

socket.on('getName', (author) => {
  username = author;
  socket.emit('joinRoom', { username, room });
});

const display = (message) => {
  const msgDiv = document.createElement('div');
  // const className = type;
  if (message.username === 'Админ' || message.username === 'Elbrus Bot') {
    msgDiv.classList.add('other-message', 'message-row');
  } else {
    msgDiv.classList.add('you-message', 'message-row');
  }

  const innerText = `
      <div class="message-title">
        🗨️<span>${message.username}</span>
      </div>
      <div class="message-text">
        ${message.text}
      </div>
      <div class="message-time">
        ${message.time}
      </div>
  `;
  msgDiv.innerHTML = innerText;
  displayMsg.appendChild(msgDiv);
};

// Message from server
socket.on('message', (message) => {
  display(message);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Message submit
input.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
