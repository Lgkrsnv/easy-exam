const socket = window.io('http://localhost:3000/');
// const socket = io();

const msgText = document.querySelector('#msg');
const btnSend = document.querySelector('#btn-send');
const chatBox = document.querySelector('.chat-content');
const displayMsg = document.querySelector('.message');
const input = document.querySelector('.msg-tex');

// document.addEventListener('click', async (event) => {
//   console.log(event.target);
//   if (event.target.id === 'chatBtn') {
//     event.preventDefault();
//     const response = await fetch('/chatInfo');
//     const result = await response.json();
//     console.log(result);
//   }
// });
let username;
const room = 'Админка';

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('getName', (author) => {
  username = author;
  socket.emit('joinRoom', { username, room });
  console.log(username, room);
  console.log(author);
});

// const username = new URLSearchParams(window.location.search).get('username');
// const room = new URLSearchParams(window.location.search).get('room');
// const username = 'Vladimir';


// Join chatroom


// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

const display = (message) => {
  const msgDiv = document.createElement('div');
  // const className = type;
  if (message.username === 'Админ' || message.username === 'Elbrus Bot') {
    msgDiv.classList.add('other-message', 'message-row');
  } else {
    msgDiv.classList.add('you-message', 'message-row');
  }
  // } else if (message.username === 'Админ' && message.text === 'Администратор ответит в ближайшее время...') {
  //   return;
  // msgDiv.classList.add(className, 'message-row');
  // const times = new Date().toLocaleTimeString();

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

// const socketConnection = io.connect();
// socketConnection.on('connect', () => {
//   const sessionID = socketConnection.socket.sessionid;
//   console.log(sessionID);
// });

// let name;

// do {
//   name = prompt('Как Вас зовут?')
// } while (!name);

// document.querySelector('#your-name').textContent = name;
// msgText.focus();

// btnSend.addEventListener('click', (e) => {
//   e.preventDefault();
//   console.log(socket.id);
//   sendMsg(msgText.value);
//   msgText.value = '';
//   msgText.focus();
//   chatBox.scrollTop = chatBox.scrollHeight;
// });

// const sendMsg = message => {
//   let msg = {
//     socketId: socket.id,
//     user: name,
//     message: message.trim(),
//   };

//   display(msg, 'you-message');
//   // socket.emit('join', msg);
//   socket.emit('sendFirstMessage', msg);
// };

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
