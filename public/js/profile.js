console.log('мы на странице профиля');

if (document.getElementById('save')) {
  document.getElementById('save').addEventListener('click', async (event) => {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
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
    if (password1 === password2) {
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
    } else {
      document.getElementById('for-new-password').textContent = 'Пароль и подтверждение должны совпадать';
    }
  });
}
