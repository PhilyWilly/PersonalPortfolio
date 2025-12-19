const htmlFrames = document.getElementsByClassName('frame');
const frameColor = 'hsla(180, 85%, 65%, 100%)';
const frameColorHover = 'hsla(180, 86%, 92%, 100%)';
const frameColorDark = 'hsla(220, 67%, 33%, 100%)';
const frameColorDarkHover = 'hsla(180, 85%, 65%, 100%)';

const frameNoFillColor =        'hsla(180, 26%, 18%, 12%)'; // When frame is not filled (low transparenty but still filled. Sorry for the confusion)
const frameNoFillColorHover =   'hsla(180, 26%, 18%, 20%)'; // When frame is not filled (low transparenty but still filled. Sorry for the confusion)
const frameFillColor =          'hsla(180, 26%, 18%, 98%)';
const frameFillColorHover =     'hsla(180, 26%, 18%, 100%)';

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
    const frameHTMLType = htmlFrames[i].children[0].localName;
    if (frameHTMLType !== "canvas") continue;
    
    // Create canvas object
    const id = "canvas-frame-" + i; 
    const dark = htmlFrames[i].children[0].parentElement.classList.value.includes("dark");
    const filled = htmlFrames[i].children[0].parentElement.classList.value.includes("filled");
    const noAnimations = htmlFrames[i].children[0].parentElement.classList.value.includes("no-animations");
    htmlFrames[i].children[0].id = id;
    frames[i] = new Frame(id, dark, filled, !noAnimations);

    // Mouse functions for animations
    htmlFrames[i].onmouseenter = mouseEnterFrame;
    htmlFrames[i].onmouseleave = mouseLeaveFrame;
    htmlFrames[i].onmousedown = mouseClickFrame;
    htmlFrames[i].onmouseup = mouseUnclickFrame;

}
resizeFrames();

function extractIndexFromID(canvasID) {
    return canvasID.slice(13,32).trim();
}
function getCanvasFromID(canvasID) {
    const id = extractIndexFromID(canvasID);
    return frames[id];
}

function paintFrame(index) {
    if (!frames[index].animations) frames[index].state = 0;
    const animationState = easeInOut(frames[index].state);
    const edge = lerp(14, 16, animationState);
    const lineWidth = lerp(2, 3, animationState);
    let borderColor;
    if (frames[index].isDark) {
        borderColor = hslaColorLerp(frameColorDark, frameColorDarkHover, animationState);
    }
    else {
        borderColor = hslaColorLerp(frameColor, frameColorHover, animationState);
    }
    
    let fillColor;
    if (frames[index].isFilled) {
        fillColor = hslaColorLerp(frameFillColor, frameFillColorHover, animationState);
    }
    else {
        fillColor = hslaColorLerp(frameNoFillColor, frameNoFillColorHover, animationState);
    }
 
    
    frames[index].paintFrame(edge, lineWidth, borderColor, fillColor, animationState);
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
    const id = event.target.children[0].id;
    const index = extractIndexFromID(id);
    if (frames[index].noAnimations) return;
    frames[index].direction = "hover";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
}
function mouseLeaveFrame(event) {
    const id = event.target.children[0].id;
    const index = extractIndexFromID(id);
    if (frames[index].noAnimations) return;
    frames[index].direction = "neutral";
    setTimeout(() => animateFrame(index), frameAnimationDuration);
    
}
function mouseClickFrame(event) {
    try {
        const id = event.target.children[0].id;
        const index = extractIndexFromID(id);
        if (frames[index].noAnimations) return;
        frames[index].direction = "clicked";
        setTimeout(() => animateFrame(index), frameAnimationDuration);
    }
    catch (e) {} // Dont print any unnecessary error message when something inside the frame is clicked
}
function mouseUnclickFrame(event) {
    try {
        const id = event.target.children[0].id;
        const index = extractIndexFromID(id);
        if (frames[index].noAnimations) return;
        frames[index].direction = "hover";
        setTimeout(() => animateFrame(index), frameAnimationDuration);
    }
    catch (e) {} // Dont print any unnecessary error message when something inside the frame is clicked
}

function resizeFrames() {
    for (let i = 0; i < frames.length; i++) {
        // Set up the canvas
        frames[i].resizeToParentSize();

        // Paint the frame
        paintFrame(i);
    }
}

