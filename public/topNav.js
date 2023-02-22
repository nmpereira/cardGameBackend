// event listener for show-card-input-form button to show card input form

// document
//   .getElementById("show-card-input-form")
//   .addEventListener("click", toggleCardInputForm);

// function toggleCardInputForm() {
//   if (is_playmode) {
//     is_playmode = false;
//     toggleUI();
//   } else {
//     is_playmode = true;
//     toggleUI();
//   }
// }

if (window.location.pathname !== "/") {
  // document.getElementById("home").style.display = "block";

  document.getElementById("show-card-input-form").innerText = "Show the deck";
  document.getElementById("show-card-input-form").href = "/";
} else {
  document.getElementById("show-card-input-form").innerText = "Add new cards";
  document.getElementById("show-card-input-form").href = "/addcontent";
}
