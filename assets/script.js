const fullScreen = document.querySelector("#fullScreen");
const spaces = document.querySelectorAll(".spaces");
const editBtn = document.querySelector("#edit");
const resetBtn = document.querySelector("#reset");
const playBtn = document.querySelector("#play");
const cancelBtn = document.querySelector("#cancel");
const confirmBtn = document.querySelector("#confirm");
const playBtnImg = document.querySelector("#play>img");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const overlayer = document.querySelector(".overlayer");
const btns = document.querySelector(".btns");
const body = document.querySelector("body");
const alarm = document.querySelector(".alarm");

const MINinSEC = 60;
const HOURinSEC = 60 * MINinSEC;
const colors = ["#242424", "#46ffbe"];

let isRun = false;
let time = 0;
let interval;

function setDisplay(el, value) {
  el.style.display = value;
}
function showBtns() {
  setDisplay(fullScreen, "block");
  setDisplay(editBtn, "block");
  setDisplay(resetBtn, "block");
  setDisplay(playBtn, "block");
  setDisplay(overlayer, "block");

  setDisplay(cancelBtn, "none");
  setDisplay(confirmBtn, "none");
}
function hiddenBtns() {
  setDisplay(fullScreen, "none");
  setDisplay(editBtn, "none");
  setDisplay(resetBtn, "none");
  setDisplay(playBtn, "none");
  setDisplay(overlayer, "none");

  setDisplay(cancelBtn, "block");
  setDisplay(confirmBtn, "block");
}
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement
      .requestFullscreen()
      .catch((err) => console.log("Fullscreen fail:", err));
  }
}
function changeTime() {
  isRun = false;
  clearInterval(interval);
  playBtnImg.src = "./assets/imgs/play.svg";
  hiddenBtns();
}
function cancelTime() {
  showBtns();
}
function confirmTime() {
  let h = parseInt(hours.value);
  let m = parseInt(minutes.value);
  let s = parseInt(seconds.value);

  time = h * HOURinSEC + m * MINinSEC + s;
  updateTime();

  showBtns();
}
function runTime() {
  if (isRun) {
    clearInterval(interval);
    isRun = false;
    playBtnImg.src = "./assets/imgs/play.svg";
    return;
  }

  isRun = true;
  playBtnImg.src = "./assets/imgs/stop.svg";

  interval = setInterval(() => {
    if (time < 11) {
      setDisplay(hours, "none");
      setDisplay(minutes, "none");
      setDisplay(btns, "none");
      spaces.forEach((space) => setDisplay(space, "none"));

      time % 2 === 0
        ? (seconds.style.color = `${colors[0]}`)
        : (seconds.style.color = `${colors[1]}`);
      time % 2 === 0
        ? (body.style.background = `${colors[1]}`)
        : (body.style.background = `${colors[0]}`);
    }
    if (time <= 0) {
      clearInterval(interval);
      isRun = false;
      alarm.play();
      setDisplay(btns, "flex");
      setDisplay(fullScreen, "none");
      setDisplay(editBtn, "none");
      setDisplay(playBtn, "none");
      setDisplay(resetBtn, "block");

      setTimeout(stopTime, 10000);
      return;
    }
    time -= 1;
    updateTime();
  }, 1000);
}
function updateTime() {
  let h = Math.floor(time / HOURinSEC);
  let m = Math.floor((time % HOURinSEC) / MINinSEC);
  let s = (time % HOURinSEC) % MINinSEC;

  if (time <= 10) {
    seconds.value = s;
    return;
  }

  hours.value = h < 10 ? `0${h}` : h;
  minutes.value = m < 10 ? `0${m}` : m;
  seconds.value = s < 10 ? `0${s}` : s;
}
function resetTime() {
  time = 30;
  isRun = false;
  clearInterval(interval);
  setDisplay(hours, "block");
  setDisplay(minutes, "block");
  spaces.forEach((space) => setDisplay(space, "block"));
  seconds.style.color = `${colors[1]}`;
  body.style.background = `${colors[0]}`;
  showBtns();
  stopTime();
  playBtnImg.src = "./assets/imgs/play.svg";
  updateTime();
}
function stopTime() {
  alarm.pause();
  alarm.currentTime = 0;
}

fullScreen.addEventListener("click", toggleFullscreen);
editBtn.addEventListener("click", changeTime);
playBtn.addEventListener("click", runTime);
resetBtn.addEventListener("click", resetTime);
cancelBtn.addEventListener("click", cancelTime);
confirmBtn.addEventListener("click", confirmTime);
updateTime();
