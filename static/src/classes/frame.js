/// Frame is the thing around the blue thing ykyk??
class Frame {
    constructor(canvas, isDark=false) {
        this.canvas = canvas;
        this.state = 0.0;
        this.direction = "neutral"; // Also "clicked" and "hover" possible
        this.isDark;
    }
}