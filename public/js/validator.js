function validMail(mail) {
  const regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/gi;
  const valid = regexp.test(mail);
  if (valid) {
    return true;
  }
  return false;
}

function validPhone(phone) {
  const regexp = /^((8|\+7)[/\- ]?)?(\(?\d{3}\)?[/\- ]?)?[\d\- ]{7,10}$/gi;
  const valid = regexp.test(phone);
  if (valid) {
    return true;
  }
  return false;
}


