function drawGrid() {
    const canvas = document.getElementById("gridCanvas");
    const context = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400
    // Grid settings
    const gridSize = 20;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    context.translate(0.5, 0.5);

    for (let row = 0; row <= canvasHeight; row += gridSize) {
        context.beginPath();
        context.moveTo(0, row);
        context.lineTo(canvasWidth, row);
        context.stroke();
    }

    for (let col = 0; col <= canvasWidth; col += gridSize) {
        context.beginPath();
        context.moveTo(col, 0)
        context.lineTo(col, canvasHeight)
        context.stroke()
    }
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    
}

function createCells() {

}

drawGrid()

