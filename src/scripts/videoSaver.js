chrome.storage.sync.get(["key"], (result) => {
  let savedVideos = JSON.parse(result.key || "[]");
  let videoEl = document.querySelector("video");

  // Adds new unique video URL to localStorage
  const saveVideo = () => {
    if (!savedVideos.some((video) => video.url === window.location.href)) {
      savedVideos.push({
        url: window.location.href,
        duration: videoEl.duration,
        progress: 0,
      });
      chrome.storage.sync.set({ key: JSON.stringify(savedVideos) }, () => {
        // * console.log("Value is set to " + JSON.stringify(savedVideos));
      });
    }
  };

  // Checking every 1s if video metadata are loaded
  // ? videoEl.onloadedmetadata(() => console.log(videoEl.duration));
  let interval = setInterval(() => {
    if (videoEl.duration) {
      saveVideo();
      clearInterval(interval);
    }
  }, 1000);

  // Updates the video progress every 5s
  // ? Would like to update when video is played, but the on events don't seem to be working
  setInterval(() => {
    savedVideos = savedVideos.map((video) =>
      video.url === window.location.href
        ? { ...video, progress: video.progress + 5 }
        : video
    );
    chrome.storage.sync.set({ key: JSON.stringify(savedVideos) }, () => {
      // * console.log("Value is updated to " + JSON.stringify(savedVideos));
    });
  }, 5000);
});
