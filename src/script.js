window.onload = () => {
  setupEventListeners();
  initializeDisplayValues();
  generatePassword();
};

function setupEventListeners() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const rangeInput = document.getElementById("password-length");
  const displayInput = document.getElementById("password-length-display");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
  rangeInput.addEventListener("input", () => {
    displayInput.value = rangeInput.value;
    generatePassword();
  });
  displayInput.addEventListener("input", () => {
    const value = parseInt(displayInput.value);
    if (!isNaN(value) && value >= parseInt(rangeInput.min) && value <= parseInt(rangeInput.max)) {
      rangeInput.value = value;
      generatePassword();
    }
  });
  displayInput.addEventListener("keypress", isNumberKey);
  displayInput.addEventListener("blur", () => {
    if (displayInput.value === "") {
      displayInput.value = rangeInput.value;
    }
  });
}

function initializeDisplayValues() {
  const rangeInput = document.getElementById("password-length");
  const displayInput = document.getElementById("password-length-display");
  displayInput.value = rangeInput.value;
}

function isNumberKey(event) {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}

function handleCheckboxChange(event) {
  const noSequentialCheckbox = document.getElementById("no-sequential-characters");
  const checkedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  if (checkedCheckboxes.length === 0 || (checkedCheckboxes.length === 1 && checkedCheckboxes[0] === noSequentialCheckbox)) {
    event.target.checked = true;
  } else {
    generatePassword();
  }
}

function passwordGenerator(length) {
  const charsets = {
    "include-numbers": "0123456789",
    "include-lowercase": "abcdefghijklmnopqrstuvwxyz",
    "include-uppercase": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "include-symbols": "!@#$%^&*()_+-=[]{}|;:,.<>?"
  };
  let charset = "";
  for (const [key, value] of Object.entries(charsets)) {
    if (document.getElementById(key).checked) {
      charset += value;
    }
  }
  if (document.getElementById("no-sequential-characters").checked) {
    charset = charset.split('').filter((c, i, arr) => arr[i - 1] !== c).join('');
  }
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function generatePassword() {
  const passwordLength = parseInt(document.getElementById("password-length").value);
  const passwordField = document.getElementById("password");
  const generatedPassword = passwordGenerator(passwordLength);
  const generateIcon = document.querySelector(".generate-button i");
  passwordField.value = generatedPassword;
  generateIcon.classList.add("spin-animation");
  setTimeout(() => {
    generateIcon.classList.remove("spin-animation");
  }, 800);
}

function copyPassword() {
  const passwordField = document.getElementById("password");
  const copyButton = document.querySelector(".copy-button");
  const copiedIndicator = document.getElementById("copied-indicator");
  passwordField.select();
  document.execCommand("copy");
  passwordField.blur();
  copyButton.innerHTML = '<i class="fas fa-check green-icon"></i> Copied';
  copiedIndicator.classList.add("active");
  setTimeout(() => {
    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Password <span id="copied-indicator"></span>';
    copiedIndicator.classList.remove("active");
  }, 2000);
}