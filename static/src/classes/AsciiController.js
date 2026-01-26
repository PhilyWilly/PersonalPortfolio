class AsciiController {
    constructor() {
        this._index = 0;
        this._indexSize;
        this._asciiPresenter = document.getElementById("ascii-presenter");
        this._resizedFramesOnce = false; // For resizing the frames once the ascii art changes
        this._animationInterval;

        this.setAnimation();
    }

    setAnimation(animationType="earth") {
        this._resizedFramesOnce = false;
        switch (animationType) {
            case "earth":
                this._setPresenterSize("x-small");
                this._indexSize = 19;
                this._animationInterval = setInterval(() => this._animationStep(), 300);
                break;
            case "cat":
                clearInterval(this._animationInterval);
                this._setPresenterSize("x-small");
                this._setPresenter(asciiCat);
                break;
            case "anime":
                clearInterval(this._animationInterval);
                this._setPresenterSize("small");
                this._setPresenter(asciiAnime);
                break;
            case "anonymus":
                clearInterval(this._animationInterval);
                this._setPresenterSize("medium");
                this._setPresenter(asciiAnonymus);
                break;
            case "arch":
                clearInterval(this._animationInterval);
                this._setPresenterSize("small");
                this._setPresenter(asciiArch);
                break;
            case "gooner":
                clearInterval(this._animationInterval);
                this._setPresenterSize("x-small");
                this._setPresenter(asciiGooner);
                break;
            default:
                throw Error("The element was not found!");
        }
    }

    _setPresenter(string) {
        this._asciiPresenter.innerHTML = "<pre>" + string + "</pre>";
        if (!this._resizedFramesOnce) {
            resizeFrames();
            this._resizedFramesOnce = true;
        }
    }

    _setPresenterSize(size) {
        this._asciiPresenter.style.fontSize = size;
    }

    _animationStep() {
        this._index = (this._index + 1) % this._indexSize;
        this._setPresenter(asciiEarth[this._index]);
    }
}

const asciiController = new AsciiController();
