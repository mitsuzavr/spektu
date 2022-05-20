export async function getFolderID(folderTitle, subTreeID) {
  let folderID = null;

  let subTree = await chrome.bookmarks.getSubTree(subTreeID);
  let subTreeFolder = subTree[0];

  // Search for folder
  subTreeFolder.children.forEach((bookmarkItem) => {
    if (!bookmarkItem.url)
      if (bookmarkItem.title === folderTitle) {
        console.log(
          `Found folder ${bookmarkItem.title} with ID ${bookmarkItem.id}`
        );
        folderID = bookmarkItem.id;
      }
  });

  // Didn't find folder, create a new one
  if (!folderID) {
    let newFolder = await chrome.bookmarks.create({
      parentId: subTreeID,
      title: folderTitle,
    });
    folderID = newFolder.id;
    console.log(`Created folder ${newFolder.title} with ID ${newFolder.id}`);
  }

  return folderID;
}

export async function createBookmark(title, URL, folderTitle, subTreeID) {
  let folderID = await getFolderID(folderTitle, subTreeID);

  chrome.bookmarks.create({
    parentId: folderID,
    title: title,
    url: URL,
  });
}
