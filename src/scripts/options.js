// Exports data
chrome.storage.sync.get(["key"], (result) => {
  const filename = "export-spektu.txt";
  const jsonStr = JSON.stringify(result);

  let exportDataBtnEl = document.querySelector("#export-data-btn");
  exportDataBtnEl.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
  );
  exportDataBtnEl.setAttribute("download", filename);
});

// Imports data
document
  .querySelector("#import-data-btn")
  .addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
  const importedData = JSON.parse(event.target.result);
  chrome.storage.sync.set({ key: importedData.key }, () => {
    alert("Successfully imported your data");
  });
}

// Deletes data
document.querySelector("#delete-data-btn").addEventListener("click", () => {
  chrome.storage.sync.set({ key: JSON.stringify({}) }, () => {
    alert("Successfully deleted your data");
  });
});
