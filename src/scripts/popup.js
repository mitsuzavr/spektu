import { getFolderID } from "../utils/bookmarks.js";

// Bookmarks
(async function () {
  const availibleThumblnails = ["marketing", "macroeconomics"];

  let bookmarksMenuEl = document.querySelector("#bookmarks-menu");
  bookmarksMenuEl.innerHTML = "";

  // Get all bookmarks in the folder
  let folderID = await getFolderID("Spektu bookmarks", "2"); // 2 is Other bookmarks folder ID
  let bookmarks = await chrome.bookmarks.getChildren(folderID);
  if (bookmarks.length > 0) {
    document.querySelector("#bookmarks").style.display = "block";

    // List all bookmarks
    bookmarks.forEach((bookmark) => {
      // Pick a thumbnail
      let bookmarkThumbnail = bookmark.title.toLowerCase(); // ! + breaks to dashes
      if (!availibleThumblnails.includes(bookmarkThumbnail))
        bookmarkThumbnail = "unavailible";

      // Create the bookmark element
      let bookmarkEl = document.createElement("a");
      bookmarkEl.classList.add(
        "p-3",
        "transition",
        "ease-in-out",
        "delay-100",
        "duration-300",
        "bg-gray-100",
        "hover:bg-gray-200",
        "text-gray-600",
        "border-b-4",
        "border-gray-200",
        "hover:border-gray-300",
        "rounded-lg"
      );
      bookmarkEl.href = bookmark.url;
      bookmarkEl.target = "_blank";
      bookmarkEl.rel = "noopener noreferrer";
      bookmarkEl.innerHTML = `
        <img
          class="mb-2 w-full"
          src="../../dist/images/thumbnails/${bookmarkThumbnail}.svg"
          alt="${bookmark.title} thumbnail"
        />
        <div class="text-sm text-center">${bookmark.title}</div>
      `;
      bookmarksMenuEl.append(bookmarkEl);
    });
  } else {
    document.querySelector("#bookmarks").style.display = "none";
  }
})();

// Options
(() => {
  document.querySelector("#options-btn").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    else window.open(chrome.runtime.getURL("options.html"));
  });
})();
