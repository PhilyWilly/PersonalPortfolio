// TODO Grid

const textColor = 'hsla(220, 67%, 33%, 35%)';

const charHeight = 22;
const charWidth = 16;
const fontSize = 14;

const speed = 45;
const spaceSwitchProbability = 0.1;


class Matrix {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isSpace = false;
        // Initialize the array
        this.charArray = [];
        for (let i = 0; i < y; i++) {
            this.charArray.push([]);
            for (let j = 0; j < x; j++) {
                this.charArray[i][j] = '';
            }
        }
    }

    shiftDown() {
        // Shift down
        for (let i = this.y - 1; i > 0; i--) {
            for (let j = 0; j < this.x; j++) {
                this.charArray[i][j] = this.charArray[i-1][j];
            }
            // this.charArray[i] = structuredClone(this.charArray[i-1]);
        }
        // Generate new characters at the top
        for (let i = 0; i < this.x; i++) {
            if (Math.random() < spaceSwitchProbability) this.isSpace = !this.isSpace;

            if (this.isSpace) {
                this.charArray[0][i] = '';
            }
            else {
                this.charArray[0][i] = this.randomCharacter();
            }
        }
    }

    randomCharacter() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const randomInd = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomInd);
    }

    printArray() {
        for (let i = 0; i < this.y; i++) {
            let row = [];
            for (let j = 0; j < this.x; j++) {
                row.push(this.charArray[i][j]);
            }
            console.log(row)
        }
    }
}

function canvasToMatrixWidth(width) {
    return Math.floor(width/charWidth) + 1;
}
function canvasToMatrixHeight(height) {
    return Math.floor(height/charHeight) + 1;
}
function sizedMatrix() {
    const matrixHeight = canvasToMatrixHeight(matrixCanvas.getHeight());
    const matrixWidth = canvasToMatrixWidth(matrixCanvas.getWidth());
    return new Matrix(matrixWidth, matrixHeight);
}

const matrixCanvas = new Canvas('matrix-background');
matrixCanvas.resizeCanvasToFullSize();
let matrix = sizedMatrix();

const gridCanvas = new Canvas('grid-background');
gridCanvas.resizeCanvasToFullSize();
gridCanvas.paintGrid();

function matrixFrame() {
    matrix.shiftDown();
    matrixCanvas.clear();
    matrixCanvas.paintMatrix(matrix);
}

setInterval(matrixFrame, speed);

// Add window resize listener to redraw canvas with proper proportions
window.addEventListener('resize', function () {
    // Debounce the resize event to avoid too many redraws
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
        matrixCanvas.resizeCanvasToFullSize();
        matrix = sizedMatrix();
        
        gridCanvas.resizeCanvasToFullSize();
        gridCanvas.paintGrid();
    }, 150);
});