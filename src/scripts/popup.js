// document.getElementById("deleteButton").addEventListener("click", () => {
//   document.getElementById("bookmark").style.display = "none";
// });

console.log("I'm alive!");

document.querySelector("#options-btn").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  else window.open(chrome.runtime.getURL("options.html"));
});
