// upload file code
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imgDiv = document.getElementById("img-div");

inputFile.addEventListener("change", uploadImage);

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
  dropArea.classList.add("highlight");
});

dropArea.addEventListener("dragleave", function (e) {
  dropArea.classList.remove("highlight");
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  dropArea.classList.remove("highlight");
  inputFile.files = e.dataTransfer.files;
  uploadImage();
});

// form starts here
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const githubUsername = document.getElementById("github-username");

// Add event listeners after your existing code
fullName.addEventListener("input", clearNameError);
email.addEventListener("input", clearEmailError);
githubUsername.addEventListener("input", clearGithubError);

// grab the error spans
const fileErrors = document.getElementsByClassName("file-errors");
const nameErrors = document.getElementsByClassName("name-errors");
const emailErrors = document.getElementsByClassName("email-errors");
const githubErrors = document.getElementsByClassName("github-errors");

const form = document.querySelector("form");

// add event listener to the form
form.addEventListener("submit", function (e) {
  e.preventDefault();
  submitInfo();
});

function uploadImage() {
  const file = inputFile.files[0]; // get the selected file

  // check if a file was selected
  if (!file) {
    fileErrors[0].textContent = "Please select a file";
    fileErrors[0].style.color = "red";
    return;
  }

  // check if the file is an image
  if (!file.type.startsWith("image/")) {
    fileErrors[0].textContent =
      "Only image files are allowed (JPEG, PNG, ..etc)";
    fileErrors[0].style.color = "red";
    inputFile.value = ""; // clear the file input
    return;
  }

  // check if the file size exceeds 8MB (8MB = 8 * 1024 * 1024 bytes)
  const maxSize = 8 * 1024 * 1024; // 8MB
  if (file.size > maxSize) {
    fileErrors[0].textContent = "File size must be less that 8MB";
    fileErrors[0].style.color = "red";
    inputFile.value = ""; // clear the file input
    return;
  }

  let imgLink = URL.createObjectURL(inputFile.files[0]);
  imgDiv.style.backgroundImage = `url(${imgLink})`;
  imgDiv.textContent = "";

  //   clear errors
  fileErrors[0].textContent = "";
}

// convert to base64 so they can be passed to other file
function toBase64(file) {
  // create promise since its an async function
  return new Promise((resolve, reject) => {

    // use FileReader browser api
    const reader = new FileReader();

    // read the file and coverts it to base64
    reader.readAsDataURL(file);

    // when successfully read, this resolves the promise 
    reader.onload = () => resolve(reader.result);

    // rejects promise in case of error
    reader.onerror = (error) => reject(error);
  });
}

// generate ticket ID
function generateIncrementalTicketId() {

  // check last id
  let lastId = localStorage.getItem("lastTicketId");

  // add 1 to the last id
  let nextId = lastId ? parseInt(lastId) + 1 : 1;

  // make lastTicketId tp nextId in the localStorage
  localStorage.setItem("lastTicketId", nextId);

  // returns the id in form of #000001 ..... and so forth
  return `#${String(nextId).padStart(5, '0')}`;
}

async function submitInfo() {
  // call the submit button to style it later
  const generateBtn = document.getElementById("generate-btn");

  // call emptyField function and assign it to hasFieldError
  const hasFieldError = emptyField();

  // if there is an error stop the function
  if (hasFieldError) return;

  // when loading button is disabled
  generateBtn.disabled = true;
  // show generating wnen function runs
  generateBtn.textContent = "Generating.....";

  // call base64 on the inputFile
  const base64Image = await toBase64(inputFile.files[0]);

  // call the generate ticket id function
  const ticketId = generateIncrementalTicketId();

  // create form data array
  const formData = {
    id: ticketId,
    name: fullName.value,
    email: email.value,
    github: githubUsername.value,
    avatar: base64Image, // store image as blob URL
  };

  // save to localStorage
  localStorage.setItem("ticketData", JSON.stringify(formData));

  // redirect to ticket page
  window.location.href = "ticket.html";
}

// clear the respective error(s) on trying to fix the error
function clearNameError() {
  nameErrors[0].textContent = "";
}

function clearEmailError() {
  emailErrors[0].textContent = "";
}

function clearGithubError() {
  githubErrors[0].textContent = "";
}

// check for empty fields and validate email
function emptyField() {

  // create hasError kind of state
  let hasError = false;

  // email regex for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // trim the data
  const fullNameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const githubUserNameValue = githubUsername.value.trim();


  // check if a file was uploaded
  if (!inputFile.files || inputFile.files.length === 0) {
    fileErrors[0].textContent = "Please upload a file";
    fileErrors[0].style.color = "red";
    hasError = true;
  } else {
    fileErrors[0].textContent = "";
    fileErrors[0].classList.remove("errors");
  }

  // check if inputs were put
  if (!fullNameValue) {
    nameErrors[0].textContent = "Please input name";
    hasError = true;
  } else {
    nameErrors[0].textContent = "";
    fileErrors[0].classList.remove("errors");
  }

  if (!emailValue) {
    emailErrors[0].textContent = "Please input email";
    hasError = true;
  } 
  
  // validate email using regex
  else if (!emailRegex.test(emailValue)) {
    emailErrors[0].textContent = "Invalid email format";
    hasError = true;
  } else {
    emailErrors[0].textContent = "";
  }

  if (!githubUserNameValue) {
    githubErrors[0].textContent = "Please input github username";
    hasError = true;
  } else {
    githubErrors[0].textContent = "";
  }

  // return the error state, where true or false
  return hasError;
}

// clear the forms on successful ticket generation and the ticket page was openned
// when user comes back to form the inputs will be cleared
window.onload = () => {
  form.reset();
};
