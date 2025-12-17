/** @type {HTMLCanvasElement} */

class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    resizeToFullSize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    resizeToParentSize() {
        const parent = this.canvas.parentElement;
        this.canvas.height = parent.clientHeight;
        this.canvas.width = parent.clientWidth;
    }

    resizeToFixedSizes() {
        this.canvas.width = 400;
        this.canvas.height = 300;
    }

    getWidth() {
        return this.canvas.width
    }
    getHeight() {
        return this.canvas.height
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    paintMatrix(matrix) {
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.fillStyle = textColor;
        for (let i = 0; i < matrix.y; i++) {
            for (let j = 0; j < matrix.x; j++) {
                this.ctx.fillText(matrix.charArray[i][j], (j+1)*charWidth, (i+1)*charHeight);
            }
        }
    }

    paintGrid(spacingX = 48, spacingY = 48) {
        this.ctx.strokeStyle = textColor;
        this.ctx.lineWidth = 1;

        const rows = Math.ceil(this.canvas.height / spacingY);
        const columns = Math.ceil(this.canvas.width / spacingX);

        for (let i = 1; i < rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * spacingY);
            this.ctx.lineTo(this.canvas.width, i * spacingY);
            this.ctx.stroke();
        }

        for (let i = 1; i < columns; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * spacingX, 0);
            this.ctx.lineTo(i * spacingX, this.canvas.height);
            this.ctx.stroke();
        }
    }    

    paintFrame(edge, lineWidth, color, d) { // d => decoration
        // Clear the frame
        this.clear();

         // Get height and width
        const height = this.getHeight();
        const width = this.getWidth();


        // Set consts
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        const hlw = lineWidth/2; // Half line width to not shoot over the edge

        // Paint frame
        this.ctx.beginPath();
        this.ctx.moveTo(0+hlw,0+hlw);
        this.ctx.lineTo(width-hlw-edge, 0+hlw);
        this.ctx.lineTo(width-hlw, 0+hlw+edge);
        this.ctx.lineTo(width-hlw, height-hlw);
        this.ctx.lineTo(0+hlw,height-hlw);
        this.ctx.lineTo(0+hlw,0+hlw);
        this.ctx.stroke();

        const stripes = 3;
        const stripesHeight = 6;
        const stripedHeightStretch = 4;
        const offsetX = 12;
        const stripesWidth = 4;
        const stripedWidthStretch = 2;
        const xStart = 8;

        // Paint stripes on the frame
        for (let i = 0; i < stripes; i++) {
            const xBegin = offsetX*i+xStart;
            this.ctx.beginPath();
            this.ctx.moveTo(hlw + xBegin ,0+hlw);
            this.ctx.lineTo(hlw + xBegin+stripesWidth+(stripedWidthStretch*d), 0+hlw + stripesHeight + (stripedHeightStretch*d));
            this.ctx.stroke();
        }        
    }
}
