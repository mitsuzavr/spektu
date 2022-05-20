import { createBookmark } from "../utils/bookmarks.js";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  createBookmark(request.title, request.url, "Spektu bookmarks", "2");
  sendResponse();
});
