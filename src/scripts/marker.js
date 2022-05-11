// Progress circle params
const width = 512;
const center = width / 2;
const stroke = 96;
const radius = center - stroke;
const circumference = radius * 2 * Math.PI;

// Color from gradient based on %
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

  let menuEl = document.querySelector("div#vMenu");
  menuEl.querySelectorAll("a.hasSubmenu").forEach((plEl) => {
    let videosCompleted = 0; // Counts how many videos have been completed

    let videoEls = plEl.nextElementSibling.querySelectorAll("a.edittllect");
    videoEls.forEach((vEl) => {
      vEl.style.width = "100%";
      vEl.style.margin = "0";

      // ! Bookmark
      let courseEl = plEl.closest("div#vMenu > ul");
      let courseTitle = courseEl.querySelector("a").textContent;

      // Video progress
      let vUrl = vEl.getAttribute("href");
      let savedVideo = savedVideos.find((sV) => sV.url === vUrl);

      if (!savedVideo) return; // Showing video progress is skipped, if the video is not in localStorage

      let progressEl = document.createElement("span");
      progressEl.style.float = "right";
      if (savedVideo.progress >= savedVideo.duration) {
        progressEl.innerHTML = `
        <svg style="fill: rgb(0, 200, 0);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24">
          <!-- Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
        </svg>`;

        videosCompleted++;
      } else {
        let percentage = savedVideo.progress / savedVideo.duration;
        let offset = circumference - percentage * circumference;

        progressEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
          <circle
            style="transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${offset};"
            stroke="${getColorForPercentage(percentage, 1)}"
            stroke-width="${stroke}"
            fill="transparent"
            r="${radius}"
            cx="${center}"
            cy="${center}"
          />
        </svg>`;
      }
      vEl.append(progressEl);
    });

    // Playlist progress
    let percentage = videosCompleted / videoEls.length;
    let bgWidth = Math.round(percentage * 100);

    plEl.style.background = `
    linear-gradient(
      to right,
      ${getColorForPercentage(percentage, 0.25)} ${bgWidth}%,
      transparent ${bgWidth}%
    )`;
  });
});
