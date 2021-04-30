document.addEventListener('click', async (event) => {
  const myModalLogin = new bootstrap.Modal(document.getElementById('exampleModal'));
  const myModalRegistration = new bootstrap.Modal(document.getElementById('exampleModal2'));
  if (event.target.id === 'getModal' || event.target.id === 'getModal2') {
    event.preventDefault();
    myModalLogin.show();
  }
  if (event.target.id === 'registrationModal') {
    event.preventDefault();
    myModalRegistration.show();
    myModalLogin.hide();
  }
  if (event.target.id === 'login') {
    event.preventDefault();
    const email = document.getElementById('inputEmail1').value;
    const password = document.getElementById('inputPassword1').value;
    if (!validMail(email)) {
      document.getElementById('subMessageEmail').textContent = 'Введите валидный электронный адрес. Пример: elbrus@gmail.com';
    }
    if (validMail(email)) {
      await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, password,
        }),
      }).then((res) => {
        console.log(res);
        if (res.status === 404) {
          return document.getElementById('subMessagePassword').textContent = 'Ошибка: 404; Cервер не может найти запрашиваемые данные';
        }
        if (res.ok) {
          return window.location = res.url;
        } else {
          document.getElementById('subMessagePassword').textContent = 'Проверьте введенные данные';
        }
      });
    }
  }
  if (event.target.id === 'registration') {
    event.preventDefault();
    const name = document.getElementById('inputUsernameRegistr').value;
    const email = document.getElementById('inputEmail1Registr').value;
    const password = document.getElementById('inputPassword1Registr').value;
    const phone = document.getElementById('inputPhoneRegistr').value;
    if (!validMail(email)) {
      document.getElementById('validatorEmail').textContent = 'Введите валидный электронный адрес';
    }
    if (!validPhone(phone)) {
      document.getElementById('validatorPhone').textContent = 'Введите валидный номер телефона. Ориентировано на российские мобильные + городские с кодом из 3 цифр';
    }
    if (validMail(email) && validPhone(phone)) {
      await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name, email, password, phone,
        }),
      }).then((res) => {
        console.log(res);
        if (res.status === 404) {
          document.getElementById('validatorEmail').textContent = 'Пользователь с таким электронным адресом уже существует';
        }
        if (res.ok) {
          window.location = res.url;
        }
      })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
