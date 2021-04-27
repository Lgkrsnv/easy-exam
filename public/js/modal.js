document.addEventListener('click', async (event) => {
  event.preventDefault();
  const myModalLogin = new bootstrap.Modal(document.getElementById('exampleModal'));
  const myModalRegistration = new bootstrap.Modal(document.getElementById('exampleModal2'));
  if (event.target.id === 'getModal' || event.target.id === 'getModal2') {
    myModalLogin.show();
  }
  if (event.target.id === 'registrationModal') {
    myModalRegistration.show();
    myModalLogin.hide();
  }
  if (event.target.id === 'login') {
    const name = document.getElementById('inputUsername').value;
    const email = document.getElementById('inputEmail1').value;
    const password = document.getElementById('inputPassword1').value;
    await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, email, password,
      }),
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        window.location = 'http://localhost:3000/profile';
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }
  if (event.target.id === 'registration') {
    const name = document.getElementById('inputUsernameRegistr').value;
    const email = document.getElementById('inputEmail1Registr').value;
    const password = document.getElementById('inputPassword1Registr').value;
    await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, email, password,
      }),
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        window.location = 'http://localhost:3000/profile';
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }
});
