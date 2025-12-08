/** @type {HTMLCanvasElement} */

class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    resizeCanvasToFullSize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    resizeCanvasToFixedSizes() {
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
}
