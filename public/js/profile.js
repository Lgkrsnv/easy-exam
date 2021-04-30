if (document.getElementById('save')) {
  new bootstrap.Popover(document.getElementById('save'), {
    trigger: 'focus',
  });
  new bootstrap.Popover(document.getElementById('savePassword'), {
    trigger: 'focus',
  });
}

if (document.getElementById('save')) {
  document.getElementById('save').addEventListener('click', async (event) => {
    document.getElementById('submessageSave').textContent = '';
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    console.log(validMail(email), validPhone(phone));
    if (!validMail(email)) {
      document.getElementById('emailSaveValidate').textContent = 'Неверный формат электронной почты. Пример: elbrus@gmail.com';
    }
    if (!validPhone(phone)) {
      document.getElementById('phoneSvaValidate').textContent = 'Введите валидный номер телефона. Ориентировано на российские мобильные + городские с кодом из 3 цифр';
    }
    if (validMail(email) && validPhone(phone)) {
      await fetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email, phone }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          console.log(document.getElementById('hello'));
          document.getElementById('hello').textContent = 'Перезайдите профиль, чтобы увидеть изменения';
          document.getElementById('submessageSave').classList.add('visible');
          document.getElementById('submessageSave').classList.remove('invisible');
          document.getElementById('submessageSave').textContent = 'Изменения сохранены';
          document.getElementById('phoneSvaValidate').textContent = '';
          document.getElementById('emailSaveValidate').textContent = '';
        } else if (res.status === 500) {
          document.getElementById('submessageSave').classList.add('visible');
          document.getElementById('submessageSave').classList.remove('invisible');
          document.getElementById('submessageSave').textContent = 'Изменения не сохранены, попробуйте ещё. Произошла ошибка сервера, возможно, что такой адрес электронной почты уже существует';
        } else {
          document.getElementById('submessageSave').classList.add('visible');
          document.getElementById('submessageSave').classList.remove('invisible');
          document.getElementById('submessageSave').textContent = 'Изменения не сохранены, попробуйте ещё';
        }
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
    if (password1.length === 0 && password2.length === 0) {
      return;
    }
    if (password1 === password2) {
      await fetch('/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ password, password1 }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 404) {
          document.getElementById('submessage2').classList.add('visible');
          document.getElementById('submessage2').classList.remove('invisible');
          document.getElementById('submessage2').textContent = 'Ошибка 404: проверьте атентификации';
        }
        if (res.ok) {
          document.getElementById('submessage2').classList.add('visible');
          document.getElementById('submessage2').classList.remove('invisible');
          document.getElementById('submessage2').textContent = 'Изменения сохранены';
        } else {
          document.getElementById('submessage2').classList.add('visible');
          document.getElementById('submessage2').classList.remove('invisible');
          document.getElementById('submessage2').textContent = 'Изменения не сохранены, неверный старый пароль';
        }
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
    await fetch('/order/', {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        window.location = 'http://localhost:3000/profile';
      }
    });
  }
});

const showPrice = document.querySelector('#showPrice');
const showFinalPrice = document.querySelector('#showFinalPrice');

if (document.querySelector('#inputType')) {
  document.querySelector('#inputType'). addEventListener('change', async (e) => {
    const price = e.target.options[e.target.selectedIndex].dataset.workprice;
    showPrice.innerText = price;
    showFinalPrice.innerText = price;
  });
}
