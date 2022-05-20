// Progress circle params
const width = 24;
const center = width / 2;
const stroke = 4;
const radius = center - stroke;
const circumference = radius * 2 * Math.PI;

// Color definitions
// ! thank
const percentColors = [
  { pct: 0.0, color: { r: 200, g: 0, b: 0 } },
  { pct: 0.5, color: { r: 255, g: 165, b: 0 } },
  { pct: 1.0, color: { r: 0, g: 200, b: 0 } },
];

function getColorForPercentage(pct, a) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  // ! let
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };

  return "rgba(" + [color.r, color.g, color.b, a].join(",") + ")";
}

chrome.storage.sync.get(["key"], (result) => {
  let savedVideos = JSON.parse(result.key || "[]");

  const menuEl = document.querySelector("div#vMenu");
  const playlistEls = menuEl.querySelectorAll("a.hasSubmenu");
  playlistEls.forEach((playlistEl) => {
    let videosCompleted = 0; // Count how many videos have been completed

    const playlistListEl = playlistEl.nextElementSibling;
    const videoEls = playlistListEl.querySelectorAll("li");
    videoEls.forEach((videoEl) => {
      // Style the video element
      videoEl.style.display = "flex";
      videoEl.style.flex = "1 0";
      videoEl.style.flexDirection = "row";
      videoEl.style.background = "#E5E7EB";

      // Get video link url & style the video link element
      const videoLinkEl = videoEl.querySelector("a.edittllect");
      videoLinkEl.style.width = "100%";
      let videoURL = videoLinkEl.getAttribute("href");

      // Add video actions element
      const videoActionsEl = document.createElement("div");
      videoActionsEl.style.display = "flex";
      videoActionsEl.style.alignItems = "center";
      videoActionsEl.style.padding = "9px 5px";

      videoEl.addEventListener("mouseover", () => {
        videoEl.style.background = "#D1D5DB";
      });
      videoEl.addEventListener("mouseout", () => {
        videoEl.style.background = "#E5E7EB";
      });

      videoEl.append(videoActionsEl);

      // # Bookmark
      // Create bookmark element & add it to the video actions element
      // let bookmarkEl = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "svg"
      // );
      // bookmarkEl.style.marginLeft = "2px";
      // bookmarkEl.style.cursor = "pointer";
      // bookmarkEl.setAttribute("width", 24);
      // bookmarkEl.setAttribute("height", 24);
      // bookmarkEl.setAttribute("fill", "none");

      // let isBookmarked = Math.random() > 0.7 ? true : false; // ! <--
      // if (isBookmarked) {
      //   bookmarkEl.innerHTML = `
      //     <path d="M19 2H5C4.44772 2 4 2.44772 4 3V21.6493C4 21.8042 4.1685 21.9003 4.30182 21.8215L11.4715 17.5808C11.7847 17.3955 12.174 17.3951 12.4877 17.5796L19.6986 21.8226C19.8319 21.9011 20 21.805 20 21.6503V3C20 2.44772 19.5523 2 19 2Z" fill="#818CF8" stroke="#818CF8" stroke-width="4"/>
      //   `;
      // } else {
      //   bookmarkEl.style.visibility = "hidden";
      //   bookmarkEl.innerHTML = `
      //     <path d="M19 2H5C4.44772 2 4 2.44772 4 3V21.6493C4 21.8042 4.1685 21.9003 4.30182 21.8215L11.4715 17.5808C11.7847 17.3955 12.174 17.3951 12.4877 17.5796L19.6986 21.8226C19.8319 21.9011 20 21.805 20 21.6503V3C20 2.44772 19.5523 2 19 2Z" stroke="#9CA3AF" stroke-width="4"/>
      //   `;

      //   // Show the bookmark on video element hover
      //   videoEl.addEventListener("mouseover", () => {
      //     bookmarkEl.style.visibility = "visible";
      //   });
      //   videoEl.addEventListener("mouseout", () => {
      //     bookmarkEl.style.visibility = "hidden";
      //   });

      //   bookmarkEl.addEventListener("click", () => {
      //     chrome.bookmarks.create({
      //       title: "bookmarks.create() on MDN",
      //       url: "https://developer.mozilla.org/Add-ons/WebExtensions/API/bookmarks/create",
      //     });
      //   });
      // }

      // videoActionsEl.append(bookmarkEl);

      // # Progress
      // Get video info from saved videos
      let videoInfo = savedVideos.find((video) => video.url === videoURL);
      if (videoInfo) {
        // If found the video info, add video progress to the video actions element
        let progressEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        progressEl.setAttribute("width", 24);
        progressEl.setAttribute("height", 24);
        progressEl.setAttribute("fill", "none");
        progressEl.style.marginLeft = "2px";

        if (videoInfo.progress >= videoInfo.duration) {
          // Show ✅ green check mark indicating completed video
          progressEl.innerHTML = `
            <path d="M2 12.5L8.52705 18.8639C8.60472 18.9396 8.72861 18.9396 8.80629 18.8639L22 6" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
          `;
          videoActionsEl.append(progressEl);

          videosCompleted++;
        } else {
          // Show progress circle
          let percentage = videoInfo.progress / videoInfo.duration;
          let offset = circumference - percentage * circumference;

          progressEl.innerHTML = `
            <circle
              style="transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${offset};"
              stroke="${getColorForPercentage(percentage, 1)}"
              stroke-width="${stroke}"
              fill="transparent"
              r="${radius}"
              cx="${center}"
              cy="${center}"
            />
          `;
          videoActionsEl.append(progressEl);
        }
      }

      // # Playlist progress
      let percentage = videosCompleted / videoEls.length;
      let backgroundWidth = Math.round(percentage * 100);

      playlistEl.style.background = `
        linear-gradient(
          to right,
          ${getColorForPercentage(percentage, 0.25)} ${backgroundWidth}%,
          transparent ${backgroundWidth}%
        )
      `;
    });
  });
});

function createBookmarkEl(videoActionsEl, videoEl, courseTitle, videoURL) {
  let bookmarkEl = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  bookmarkEl.style.marginLeft = "2px";
  bookmarkEl.style.cursor = "pointer";
  bookmarkEl.setAttribute("width", 24);
  bookmarkEl.setAttribute("height", 24);
  bookmarkEl.setAttribute("fill", "none");

  // Create bookmark on click
  bookmarkEl.addEventListener("click", () => {
    chrome.runtime.sendMessage({ title: courseTitle, url: videoURL });
  });

  // Decide to show bookmark or not
  let isBookmarked = Math.random() > 0.7 ? true : false; // ! <--
  if (isBookmarked) {
    bookmarkEl.visibility = "visible"; // ! test with display
    bookmarkEl.innerHTML = `
      <path d="M19.8 2H4.2C4.08954 2 4 2.08954 4 2.2V21.6493C4 21.8042 4.1685 21.9003 4.30182 21.8215L11.4715 17.5808C11.7847 17.3955 12.174 17.3951 12.4877 17.5796L19.6986 21.8226C19.8319 21.9011 20 21.805 20 21.6503V2.2C20 2.08954 19.9105 2 19.8 2Z" fill="#818CF8" stroke="#818CF8" stroke-width="4"/>
    `;
  } else {
    bookmarkEl.style.visibility = "hidden";
    bookmarkEl.innerHTML = `
      <path d="M19.8 2H4.2C4.08954 2 4 2.08954 4 2.2V21.6493C4 21.8042 4.1685 21.9003 4.30182 21.8215L11.4715 17.5808C11.7847 17.3955 12.174 17.3951 12.4877 17.5796L19.6986 21.8226C19.8319 21.9011 20 21.805 20 21.6503V2.2C20 2.08954 19.9105 2 19.8 2Z" stroke="#9CA3AF" stroke-width="4"/>
    `;

    // Show the bookmark on video element hover
    videoEl.addEventListener("mouseover", () => {
      bookmarkEl.style.visibility = "visible";
    });
    videoEl.addEventListener("mouseout", () => {
      bookmarkEl.style.visibility = "hidden";
    });
  }

  videoActionsEl.append(bookmarkEl);
}

function createProgressEl(savedVideos, videoURL, videoActionsEl) {
  // Get video info from saved videos
  let videoInfo = savedVideos.find((video) => video.url === videoURL);

  if (videoInfo) {
    // If found the video info, add video progress to the video actions element
    let progressEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    progressEl.setAttribute("width", 24);
    progressEl.setAttribute("height", 24);
    progressEl.setAttribute("fill", "none");
    progressEl.style.marginLeft = "2px";

    if (videoInfo.progress >= videoInfo.duration) {
      // Show ✅ green check mark indicating completed video
      progressEl.innerHTML = `
            <path d="M2 12.5L8.52705 18.8639C8.60472 18.9396 8.72861 18.9396 8.80629 18.8639L22 6" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
          `;
      videoActionsEl.append(progressEl);

      videosCompleted++;
    } else {
      // Show progress circle
      let percentage = videoInfo.progress / videoInfo.duration;
      let offset = circumference - percentage * circumference;

      progressEl.innerHTML = `
            <circle
              style="transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${offset};"
              stroke="${getColorForPercentage(percentage, 1)}"
              stroke-width="${stroke}"
              fill="transparent"
              r="${radius}"
              cx="${center}"
              cy="${center}"
            />
          `;
      videoActionsEl.append(progressEl);
    }
  }
}

(async () => {
  let storage = await chrome.storage.sync.get();
  let savedVideos = JSON.parse(storage.key || "[]");

  const menuEl = document.querySelector("div#vMenu");
  const playlistEls = menuEl.querySelectorAll("a.hasSubmenu");
  playlistEls.forEach((playlistEl) => {
    var videosCompleted = 0; // Count completed videos in the playlist

    let courseEl = playlistEl.closest("div#vMenu > ul");
    let courseTitle = courseEl.querySelector("a").textContent;

    // Loop through all videos in the playlist
    const playlistListEl = playlistEl.nextElementSibling;
    const videoEls = playlistListEl.querySelectorAll("li");
    videoEls.forEach((videoEl) => {
      // Style video element
      videoEl.style.display = "flex";
      videoEl.style.flex = "1 0";
      videoEl.style.flexDirection = "row";
      videoEl.style.background = "#E5E7EB";
      videoEl.addEventListener("mouseover", () => {
        videoEl.style.background = "#D1D5DB";
      });
      videoEl.addEventListener("mouseout", () => {
        videoEl.style.background = "#E5E7EB";
      });

      // Get video URL
      const videoLinkEl = videoEl.querySelector("a.edittllect");
      videoLinkEl.style.width = "100%";
      let videoURL = videoLinkEl.getAttribute("href");

      // Create video actions element & add it to the video element
      const videoActionsEl = document.createElement("div");
      videoActionsEl.style.display = "flex";
      videoActionsEl.style.alignItems = "center";
      videoActionsEl.style.padding = "9px 5px";
      videoEl.append(videoActionsEl);

      createBookmarkEl(videoActionsEl, videoEl, courseTitle, videoURL);

      createProgressEl(savedVideos, videoURL, videoActionsEl);
    });
  });
})();
