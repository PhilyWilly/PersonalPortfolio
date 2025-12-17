const htmlFrames = document.getElementsByClassName('canvas-frame');
const frameColor = 'hsla(180, 85%, 65%, 100%)';
const frameColorHover = 'hsla(180, 86%, 92%, 100%)';
const frameColorDark = 'hsla(220, 67%, 33%, 100%)';
const frameColorDarkHover = 'hsla(180, 85%, 65%, 100%)';

// Frame styles
const edge = 16;
const lineWidth = 3;

// Store canvas data (+ animations)
let frames = []; // Frame objects

// Animations
const frameAnimationSteps = 8;
const frameAnimationDuration = 25; // in ms
const clickValue = 0.4;


for (let i = 0; i < htmlFrames.length; i++) {
    // Dont do anything if the object isnt a canvas
    const frameHTMLType = htmlFrames[i].localName;
    if (frameHTMLType !== "canvas") continue;
    
    // Create canvas object
    const id = "canvas-frame-" + i; 
    htmlFrames[i].id = id;
    frames[i] = new Frame(new Canvas(id));
    if (htmlFrames[i].parentElement.classList.value.includes("dark")) {
        frames[i].isDark = true;
    }

    // Mouse functions for animations
    frames[i].canvas.canvas.onmouseenter = mouseEnterFrame;
    frames[i].canvas.canvas.onmouseleave = mouseLeaveFrame;
    frames[i].canvas.canvas.onmousedown = mouseClickFrame;
    frames[i].canvas.canvas.onmouseup = mouseUnclickFrame;

    resizeFrames();
}

function extractIndexFromID(canvasID) {
    return canvasID.slice(13,32).trim();
}
function getCanvasFromID(canvasID) {
    const id = extractIndexFromID(canvasID);
    return frames[id].canvas;
}

function paintFrame(index) {
    const animationState = easeInOut(frames[index].state);
    const edge = lerp(14, 16, animationState);
    const lineWidth = lerp(2, 3, animationState);
    let color;
    if (frames[index].isDark) {
        color = hslaColorLerp(frameColorDark, frameColorDarkHover, animationState);
    }
    else {
        color = hslaColorLerp(frameColor, frameColorHover, animationState);
    }
    frames[index].canvas.paintFrame(edge, lineWidth, color, animationState);
}

function animateFrame(index) {
    try {
        // console.log("[ DEBUG ] " + frames[index].direction);
        if (frames[index].direction === "hover") {
            frames[index].state += 1/frameAnimationSteps;
            if (frames[index].state >= 1) {
                frames[index].state = 1; 
                return;
            }
        }
        else if (frames[index].direction === "clicked") {
            if (frames[index].state <= (clickValue+1/frameAnimationSteps) && frames[index].state >= (clickValue-1/frameAnimationSteps)) {
                frames[index].state = clickValue; 
                return;
            }
            if (frames[index].state > clickValue) {
                frames[index].state -= 1/frameAnimationSteps;
            }
            else {
                frames[index].state += 1/frameAnimationSteps;
            }
            if (frames[index].state <= (clickValue+1/frameAnimationSteps) && frames[index].state >= (clickValue-1/frameAnimationSteps)) {
                frames[index].stater = clickValue; 
                return;
            }
        }
        else {
            frames[index].state -= 1/frameAnimationSteps;
            if (frames[index].state <= 0) {
                frames[index].state = 0; 
                return;
            }
        }
    
        setTimeout(() => animateFrame(index), frameAnimationDuration);
    }
    finally {
        paintFrame(index);
    }
}

function mouseEnterFrame(event) {
    const id = event.target.id;
    const index = extractIndexFromID(id);
    frames[index].direction = "hover";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
}
function mouseLeaveFrame(event) {
    const id = event.target.id;
    const index = extractIndexFromID(id);
    frames[index].direction = "neutral";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
    
}
function mouseClickFrame(event) {
    const id = event.target.id;
    const index = extractIndexFromID(id);
    frames[index].direction = "clicked";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
}
function mouseUnclickFrame(event) {
    const id = event.target.id;
    const index = extractIndexFromID(id);
    frames[index].direction = "hover";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
}

function resizeFrames() {
    for (let i = 0; i < frames.length; i++) {
        // Set up the canvas
        frames[i].canvas.resizeToParentSize();

        // Paint the frame
        paintFrame(i);
    }
}

