let index = 0;
const asciiPresenter = document.getElementById("spinning-earth");
let resizedFramesOnce = false;

function step() {
    index = (index + 1) % 19;
    asciiPresenter.innerHTML = "<pre>" + n[index] + "</pre>";
    if (!resizedFramesOnce) {
        resizeFrames();
        resizedFramesOnce = true;
    }
}

setInterval(step, 300);
