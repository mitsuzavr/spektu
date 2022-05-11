// -- Bookmarks --
function onRejected(error) {
  console.log(`An error: ${error}`);
}

function findFolderID(folderTitle, subTreeID) {
  chrome.bookmarks.getSubTree(subTreeID).then((subTree) => {
    let subTreeFolder = subTree[0];
    let foundFolder = false;

    subTreeFolder.children.forEach((bookmarkItem) => {
      if (!bookmarkItem.url)
        if (bookmarkItem.title === folderTitle) {
          folderID = bookmarkItem.id;
          foundFolder = true;
          console.log(
            `Found folder ${bookmarkItem.title} with ID ${bookmarkItem.id}`
          );
        }
    });

    if (!foundFolder) {
      chrome.bookmarks.create(
        { parentId: subTreeID, title: folderTitle },
        (newFolder) => {
          folderID = newFolder.id;
          console.log(
            `Created folder ${newFolder.title} with ID ${newFolder.id}`
          );
        }
      );
    }
  }, onRejected);
}

// ! listBookmarks();

// ! removeBookmark();

var folderID = findFolderID("Spektu bookmarks", "2"); // 2 is Other bookmarks folder ID

// -- Options --
document.querySelector("#options-btn").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  else window.open(chrome.runtime.getURL("options.html"));
});
