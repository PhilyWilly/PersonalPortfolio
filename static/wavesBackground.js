/** @type {HTMLCanvasElement} */
let mousePosition = { 'x': 0, 'y': 0 }
var style = window.getComputedStyle(document.body)

class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.profileImage = null;
        this.loadProfileImage();
        this.resizeCanvas();
        //this.observeCanvasSize();
    }

    loadProfileImage() {
        this.profileImage = new Image();
        this.profileImage.onload = () => {
            // Redraw when image is loaded
            if (lines.length > 0) {
                this.draw(lines);
            }
        };
        this.profileImage.src = document.getElementById('picture-of-myself').src;
    }
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    observeCanvasSize() {
        const resizeObserver = new ResizeObserver(() => { this.resizeCanvas; setTimeout(() => { generateNewLines() }, 500); });
        resizeObserver.observe(this.canvas);
    }
    draw(objectList) {
        this.resizeCanvas();
        this.clear();
        console.log(objectList[0]);

        // Update line positions based on current canvas height
        this.updateLinePositions(objectList);

        // Draw the first 3 waves (background waves - behind the image)
        for (let i = 0; i < objectList.length - 1; i++) {
            this.drawLine(objectList[i], false, objectList[i].getColor());
        }

        // Draw the profile image on top of the background waves
        this.drawProfileImage();


        // Draw the bottom wave (index 0) on top of everything
        this.drawLine(objectList[objectList.length - 1], false, objectList[objectList.length - 1].getColor());
    }

    updateLinePositions(objectList) {
        const canvasHeight = this.canvas.height;

        objectList.forEach((line, lineIndex) => {
            const offset = line.offsetValue;
            const newStartY = canvasHeight - 340 - offset;
            const yDifference = newStartY - line.originalStartY;

            // Update each position in the line by the difference
            line.positions.forEach((position, posIndex) => {
                // Update Y position by the canvas height difference
                position[1] += yDifference;

                // Apply limits for the first line (face cutout) after updating
                if (line.isLimited) {
                    const minY = canvasHeight - 280;
                    const maxY = canvasHeight - 75;
                    position[1] = Math.min(Math.max(position[1], minY), maxY);
                }

                // Update control points if they exist (from smoothOutLines)
                if (position.length > 4) {
                    position[3] += yDifference; // Update first control point Y
                    position[5] += yDifference; // Update second control point Y

                    // Apply limits to control points too if needed
                    if (line.isLimited) {
                        const minY = canvasHeight - 280;
                        const maxY = canvasHeight - 75;
                        position[3] = Math.min(Math.max(position[3], minY), maxY);
                        position[5] = Math.min(Math.max(position[5], minY), maxY);
                    }
                }
            });

            // Update the line's reference point for next resize
            line.originalStartY = newStartY;
        });
    }
    getWidth() {
        return this.canvas.width
    }
    getHeight() {
        return this.canvas.height
    }

    drawProfileImage() {
        if (!this.profileImage) return;

        // Only show image if canvas width is greater than 1200px
        if (this.canvas.width <= 1200) return;

        // Get the original image element to calculate position and size
        const originalImg = document.getElementById('picture-of-myself');
        const imgContainer = document.getElementById('picture-of-myself-container');

        if (!originalImg || !imgContainer) return;

        // Use original sizing logic but with aspect ratio preservation
        const baseSize = Math.min(this.canvas.width, this.canvas.height) * 0.69 * 1.2;

        // Maintain aspect ratio - get the natural dimensions of the image
        const aspectRatio = this.profileImage.naturalWidth / this.profileImage.naturalHeight;

        // For square images, use baseSize as is. For rectangular, adjust accordingly
        let imageWidth, imageHeight;
        if (aspectRatio >= 1) {
            // Width is greater than or equal to height
            imageWidth = baseSize;
            imageHeight = baseSize / aspectRatio;
        } else {
            // Height is greater than width  
            imageHeight = baseSize;
            imageWidth = baseSize * aspectRatio;
        }

        // Original positioning logic
        const margin = this.canvas.width * 0.069; // 10% margin from right edge
        const x = this.canvas.width - imageWidth - margin;
        const y = (this.canvas.height - imageHeight) - 75;

        // Draw the image with proper aspect ratio
        this.ctx.drawImage(this.profileImage, x, y, imageWidth, imageHeight);
    }

    drawLine(lineObject, drawCircles, color) {
        this.ctx.shadowBlur = 128;
        this.ctx.shadowOffsetY = -28;
        this.ctx.shadowColor = style.getPropertyValue('--dark');


        const props = lineObject.getPositions();
        this.ctx.beginPath();
        this.ctx.moveTo(props[0][0], props[0][1]);
        for (let i = 1; i < props.length; i++) {
            this.ctx.bezierCurveTo(props[i - 1][4], props[i - 1][5], props[i][2], props[i][3], props[i][0], props[i][1]);
        }
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);

        this.ctx.fillStyle = color;

        this.ctx.fill();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


class Line {
    constructor(offset, limit = false) {
        this.positions = [];
        this.color = darkenHSL(style.getPropertyValue('--light'), offset / 4);
        this.isLimited = limit;
        console.log(this.color);

        offset = offset - 175;

        let x = 0;
        // Get initial canvas height for relative calculations
        const canvasHeight = matrixCanvas.getHeight();
        let y = canvasHeight - 270 - (Math.random() * 80) - offset;
        const startY = canvasHeight - 340 - offset;

        // Store original reference points for relative positioning
        this.originalStartY = startY;
        this.offsetValue = offset;

        let direction = (Math.random() - 0.3) / 2;

        let i = 0

        const properties = [x, y, x, y];
        this.positions.push(properties);
        while (x < matrixCanvas.getWidth() + 200 & i < 20) {
            const steps = Math.floor(Math.random() * 200) + 100

            x += Math.max(Math.cos(direction) * steps, 10);
            y -= Math.sin(direction) * steps;
            if (limit) {
                const minY = canvasHeight - 260;
                const maxY = canvasHeight - 75;
                y = Math.min(Math.max(y, minY), maxY);
            }

            direction += (Math.random() - 0.5) / 4;
            direction -= Math.pow((startY - y) / 100, 3) / 4;
            direction = Math.min(Math.max(direction, -1), 1);

            const properties = [x, y];
            this.positions.push(properties);
            i++;
        }

        this.smoothOutLines();
    }
    getPositions() {
        return this.positions;
    }

    getSize() {
        return this.size
    }
    getOpacity() {
        return this.opacity
    }
    getColor() {
        return this.color
    }

    update() {
        this.removeSmovedLines();
        this.smoothOutLines();
        matrixCanvas.resizeCanvas();
        //console.log(this.positions[1].length)
    }
    removeSmovedLines() {
        for (let i = 0; i < this.positions.length - 1; i++) {
            //console.log(this.positions[i]);
            this.positions[i] = this.positions[i].slice(0, 2);
        }
    }
    smoothOutLines() {
        this.positions.forEach((x, i) => {
            if (i == 0) {
                x.push(x[0]);
                x.push(x[1]);
                x.push(x[0]);
                x.push(x[1]);
            }
            else if (i == this.positions.length - 1) {
                x.push(x[0]);
                x.push(x[1]);
                x.push(x[0]);
                x.push(x[1]);
            }
            else {
                const previousX = this.positions[i - 1][0];
                const previousY = this.positions[i - 1][1];
                const nextX = this.positions[i + 1][0];
                const nextY = this.positions[i + 1][1];

                const direction = Math.atan((previousY - nextY) / (previousX - nextX));


                const steps2 = Math.floor(Math.sqrt((Math.pow(previousX - x[0], 2) + Math.pow(previousY - x[1], 2))) / 2);

                const d2X = Math.cos(direction - Math.PI) * steps2;
                const d2Y = Math.sin(direction - Math.PI) * steps2;

                x.push(x[0] + d2X);
                x.push(x[1] + d2Y);


                const steps = Math.floor(Math.sqrt(Math.pow(nextX - x[0], 2) + Math.pow(nextY - x[1], 2)) / 2);

                const dX = Math.cos(direction) * steps;
                const dY = Math.sin(direction) * steps;

                x.push(x[0] + dX);
                x.push(x[1] + dY);


            }
        });
    }
}

const matrixCanvas = new Canvas('experimental-canvas');

const lines = []
function generateNewLines() {
    lines.splice(0, lines.length);

    for (let i = 0; i < 4; i++) {
        lines.push(new Line(i * 80, i == 0 ? limit = true : limit = false));
    }
    lines.reverse();
    console.log(lines);
    matrixCanvas.draw(lines);
}

function darkenHSL(hsl, amount = 10) {
    return hsl.replace(
        /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/,
        (match, h, s, l) => {
            let newL = Math.max(0, parseInt(l) - amount);
            return `hsl(${h}, ${s}%, ${newL}%)`;
        }
    );
}

generateNewLines();

// Add window resize listener to redraw canvas with proper proportions
window.addEventListener('resize', function () {
    // Debounce the resize event to avoid too many redraws
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
        matrixCanvas.resizeCanvas();
        matrixCanvas.draw(lines);
    }, 150);
});

window.addEventListener('mousemove', function (e) {
    mousePosition.x = e.x;
    mousePosition.y = e.y;
});

/*const updateInterval = setInterval(function() {
    for (let i = 0; i < lines.length; i++) {
        lines[i].update();
    }

    canvas.draw(lines);
}, 500);*/