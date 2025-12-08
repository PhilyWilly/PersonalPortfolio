let index = 0;
const asciiPresenter = document.getElementById("spinning-earth");

function step() {
    index = (index + 1) % 19;
    asciiPresenter.innerHTML = "<pre>" + n[index] + "</pre>";
}

setInterval(step, 300);
