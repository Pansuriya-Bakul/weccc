function MandatoryFieldCheck(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  }
  return error;
}
function ValidateName(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  } else if (input.match("[^a-zA-Z]")) {
    error = "Invalid name";
  } else if (input.length > 60) {
    error = "Name is too long";
  }
  return error;
}
function ValidateFullName(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  } else if (!/^[a-zA-Z\s]+$/.test(input)) {
    error = "Invalid name";
  } else if (input.length > 60) {
    error = "Name is too long";
  }
  return error;
}
function ValidateCity(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (input && input.match("[^a-zA-Z]")) {
    error = "Invalid city name";
  } else if (input && input.length > 60) {
    error = "City name is too long";
  }
  return error;
}
function ValidatePostalCode(input) {
  const postalCodeRegex = /^([A-CEGHJ-NPR-TVXY]\d[A-CEGHJ-NPR-TV-Z])\s?(\d[A-CEGHJ-NPR-TV-Z]\d)$|^\d{5}(?:[-\s]\d{4})?$/i;
  if (!input || !input.match(postalCodeRegex)) {
    return "Invalid postal code";
  }
  return "";
}

function ValidateUserName(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  } else if (input.match("[^a-zA-Z0-9_@]")) {
    error = "Username should only contain alphanumerals, _ and @";
  } else if (input.length < 4) {
    error = "Username is too short";
  }
  return error;
}
function ValidatePhoneNo(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "";
    // error = "Cannot be whitespace alone";
  } else if (!input) {
    // error = "";
    error = "Cannot be empty";
  } else if (!input.match(/^[1-9]\d*$/)) {
    error = "Invalid phone number";
  } else if (input.length < 10) {
    error = "Invalid phone number. Please enter 10 digits";
  } else if (input.length > 10) {
    error = "Invalid phone number. Please enter 10 digits";
  }
  return error;
}
function ValidateEmail(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  } else if (
    !input.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    error = "Invalid email";
  }
  return error;
}
function ValidatePassword(input) {
  let error = "";
  if (input && input.trim().length === 0) {
    error = "Cannot be whitespace alone";
  } else if (!input) {
    error = "Cannot be empty";
  } else if (input.length < 8) {
    error = "Minimum 8 characters required";
  } else if (input.length > 16) {
    error = "Maximum length must be 16 characters";
  } else if (!input.match(".*[0-9].*")) {
    error = "Atleast one number required";
  } else if (!input.match(".*[a-zA-Z].*")) {
    error = "Atleast one letter required";
  } else if (!input.match(".*[a-z].*")) {
    error = "Atleast one small letter required";
  } else if (!input.match(".*[A-Z].*")) {
    error = "Atleast one capital letter required";
  } else if (!input.match(/[*@!#%&()^~{}]/)) {
    error = "Atleast one special character is required";
  }
  return error;
}
export {
  ValidateUserName,
  ValidateName,
  ValidateFullName,
  ValidatePhoneNo,
  ValidateEmail,
  ValidatePassword,
  MandatoryFieldCheck,
  ValidatePostalCode,
  ValidateCity
};
