// get the data from the form and the generated id
const ticketData = JSON.parse(localStorage.getItem("ticketData"));


// get the elements that hold this fields and update them with the ticketData
document.getElementsByClassName("users-name")[0].textContent = ticketData.name;
document.getElementsByClassName("ticket-user-name")[0].textContent =
  ticketData.name;
document.getElementsByClassName("users-email")[0].textContent =
  ticketData.email;
document.getElementsByClassName("ticket-github")[0].textContent =
  ticketData.github;
document.getElementById("avatar").src = ticketData.avatar;
document.getElementsByClassName("ticket-id")[0].textContent = ticketData.id;