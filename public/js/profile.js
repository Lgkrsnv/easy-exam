if (document.getElementById('save')){
  new bootstrap.Popover(document.getElementById('save'), {
    trigger: 'focus',
  });
  new bootstrap.Popover(document.getElementById('savePassword'), {
    trigger: 'focus',
  });
}

if (document.getElementById('save')) {
  document.getElementById('save').addEventListener('click', async (event) => {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    console.log(validMail(email), validPhone(phone));
    if (validMail(email) && validPhone(phone)) {
      await fetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email, phone }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          document.getElementById('hello').textContent = `Здравствуйте, ${name}`;
          document.getElementById('submessage').classList.toggle('visible');
          document.getElementById('submessage').classList.toggle('invisible');
          document.getElementById('submessage').textContent = 'Изменения сохранены';
        }
      }).catch(() => {
        document.getElementById('hello').textContent = `Здравствуйте, ${name}`;
        document.getElementById('submessage').classList.toggle('visible');
        document.getElementById('submessage').classList.toggle('invisible');
        document.querySelector('.submessage').textContent = 'Изменения сохранены';
        document.querySelector('.submessage').textContent = 'Изменения не сохранены, попробуйте ещё';
      });
    }
  });
}
if (document.getElementById('deleteProfile')) {
  document.getElementById('deleteProfile').addEventListener('click', async (event) => {
    await fetch('/profile', {
      method: 'DELETE',
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        window.location = 'http://localhost:3000/';
      }
    })
      .catch((error) => {
        console.log(error);
      });
  });
}

if (document.getElementById('savePassword')) {
  document.getElementById('savePassword').addEventListener('click', async (event) => {
    const password = document.getElementById('pas').value;
    const password1 = document.getElementById('newPas').value;
    const password2 = document.getElementById('newPasRepeat').value;
    if (password1 === password2 && password.length > 0) {
      await fetch('/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ password, password1 }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          document.getElementById('submessage2').classList.toggle('visible');
          document.getElementById('submessage2').classList.toggle('invisible');
          document.getElementById('submessage2').textContent = 'Изменения сохранены';
        }
      }).catch(() => {
        document.getElementById('submessage2').classList.toggle('visible');
        document.getElementById('submessage2').classList.toggle('invisible');
        document.getElementById('submessage2').textContent = 'Изменения не сохранены';
      });
    }
  });
}

document.addEventListener('click', async (event) => {
  const myModalDelete = new bootstrap.Modal(document.getElementById('myModal'));
  if (event.target.id === 'showModal') {
    myModalDelete.show();
  }
  const myModalСancelled = new bootstrap.Modal(document.getElementById('myModalCancel'));
  if (event.target.id === 'showModalCancel') {
    myModalСancelled.show();
  }
  if (event.target.id === 'cancel') {
    const id = 'тут номер или айди заказа';
    await fetch(`/order/`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        window.location = res.url;
      }
    });
  }
});

