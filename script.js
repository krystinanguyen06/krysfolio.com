
const video = document.getElementById("pitchVideo");
const overlay = document.getElementById("videoOverlay");
const playButton = document.getElementById("playButton");
const controls = document.getElementById("videoControls");
const pauseButton = document.getElementById("pauseButton");
const timeline = document.getElementById("timeline");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const soundButton = document.getElementById("soundButton");
const errorMessage = document.getElementById("videoError");

let isSeeking = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateTime() {
  currentTimeDisplay.textContent = formatTime(video.currentTime);

  if (Number.isFinite(video.duration)) {
    durationDisplay.textContent = formatTime(video.duration);

    if (!isSeeking) {
      timeline.value = video.duration
        ? (video.currentTime / video.duration) * 100
        : 0;
    }
  }
}

async function playVideo() {
  errorMessage.hidden = true;

  try {
    video.muted = false;
    video.volume = 1;

    await video.play();

    overlay.hidden = true;
    controls.hidden = false;
  } catch (error) {
    errorMessage.textContent =
      "Unable to play the video. Please try again.";
    errorMessage.hidden = false;
  }
}

playButton.addEventListener("click", playVideo);

pauseButton.addEventListener("click", async () => {
  if (video.paused) {
    await playVideo();
  } else {
    video.pause();
  }
});

video.addEventListener("play", () => {
  pauseButton.textContent = "Ⅱ";
  pauseButton.setAttribute("aria-label", "Pause video");
  controls.hidden = false;
  overlay.hidden = true;
});

video.addEventListener("pause", () => {
  pauseButton.textContent = "▶";
  pauseButton.setAttribute("aria-label", "Play video");
});

video.addEventListener("loadedmetadata", updateTime);
video.addEventListener("durationchange", updateTime);
video.addEventListener("timeupdate", updateTime);

timeline.addEventListener("input", () => {
  isSeeking = true;

  if (Number.isFinite(video.duration)) {
    const seekTime = (Number(timeline.value) / 100) * video.duration;
    currentTimeDisplay.textContent = formatTime(seekTime);
  }
});

timeline.addEventListener("change", () => {
  if (Number.isFinite(video.duration)) {
    video.currentTime =
      (Number(timeline.value) / 100) * video.duration;
  }

  isSeeking = false;
  updateTime();
});

soundButton.addEventListener("click", () => {
  video.muted = !video.muted;

  soundButton.textContent = video.muted ? "SOUND OFF" : "SOUND ON";
  soundButton.setAttribute(
    "aria-label",
    video.muted ? "Unmute video" : "Mute video"
  );
});

video.addEventListener("ended", () => {
  overlay.hidden = false;
  controls.hidden = true;

  playButton.innerHTML =
    '<span class="play-icon" aria-hidden="true">↻</span>' +
    "<span>WATCH AGAIN</span>";

  timeline.value = 0;
  currentTimeDisplay.textContent = "0:00";
});

video.addEventListener("error", () => {
  errorMessage.textContent =
    "Video could not be loaded. Check the video file path.";
  errorMessage.hidden = false;
});
