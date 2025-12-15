function lerp(value1, value2, state) {
    return value1 + (value2-value1) * state
}
function hslaColorLerp(color1, color2, state) {
    const [h1, s1, l1, a1] = color1.match(/\d+\.?\d*/g).map(Number);
    const [h2, s2, l2, a2] = color2.match(/\d+\.?\d*/g).map(Number);
    return "hsla(" + lerp(h1, h2, state) + ", " + lerp(s1, s2, state) + "%, " + lerp(l1, l2, state) + "%, " + lerp(a1, a2, state) + ")";
}

function easeInOut(state) { // State is between 0.0 and 1.0
    return (Math.cos(Math.PI*(-state+1))+1) / 2;
}
