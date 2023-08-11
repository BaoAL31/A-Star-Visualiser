function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const canvas = document.getElementById("gridCanvas");
const context = canvas.getContext("2d");
// Set canvas size
canvas.width = 900;
canvas.height = 600
// Grid settings
const gridSize = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const rows = canvasHeight / gridSize;
const cols = canvasWidth / gridSize;
context.translate(1, 1);

function colorCell(row, col, color, size = 1) {
    context.fillStyle = color;
    context.fillRect(col * gridSize, row * gridSize, gridSize * size, gridSize * size);
}

function drawGrid() {
    context.lineWidth = 2;
    for (let row = 0; row <= rows * gridSize; row += gridSize) {
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
    constructor(row, col, wall = false) {
        this.row = row;
        this.col = col;
        this.wall = wall;
        this.g = Number.MAX_VALUE;
        this.f = Number.MAX_VALUE;
        this.parent;
    }

    getNeighbours(grid) {
        let neighbours = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (grid[this.row + i][this.col + j].wall != true && (i != 0 || j != 0)) {
                    neighbours.push(grid[this.row + i][this.col + j]);
                }
            }
        }
        return neighbours;
    }
}

let grid = []

function createCells() {
    for (let row = 0; row < rows; row++) {
        let gridRow = []
        for (let col = 0; col < cols; col++) {
            let wall = false;
            if (row === 0 || col === 0 || row === rows - 1 || 
                col === cols - 1 || Math.random() < 0.5) {
                wall = true;
            }
            gridRow.push(new Cell(row, col, wall));
        }
        grid.push(gridRow);
    }
}

function distance(cell1, cell2) {
    let a = cell1.row - cell2.row;
    let b = cell1.col - cell2.col;
    return Math.sqrt(a*a + b*b);
}

drawGrid();
createCells();
let start = grid[1][1];
start.g = 0;
start.wall = false;
let end = grid[rows - 2][cols - 2]
end.wall = false

function updateColor(current, openSet) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const row of grid) {
        for (const cell of row) {
            if (cell.wall == false)
                colorCell(cell.row, cell.col, "white");
            else {
                colorCell(cell.row, cell.col, '#5A5A5A')
            }
        }
    }
    for (const cell of openSet) {
        colorCell(cell.row, cell.col, "purple")
    }
    while (current.parent != undefined) {
        colorCell(current.row, current.col, "blue");
        current = current.parent;
    }
    colorCell(1, 1, "red")
    colorCell(rows - 2, cols - 2, "green")
}

async function AStar() {
    openSet = [start];
    while (openSet.length != 0) {
        let current = openSet[0];
        // Find min fScore
        for (const cell of openSet) {
            if (cell.f < current.f) {
                current = cell;
            }
        }
        if (current == end) {
            updateColor(current, openSet)
            console.log("Succeed!")
            return true;
        }

        let idx = openSet.indexOf(current);
        openSet.splice(idx, 1);
        for (const neighbour of current.getNeighbours(grid)) {
            tempG = current.g + 1;
            if (tempG < neighbour.g) {
                neighbour.parent = current;
                neighbour.g = tempG;
                neighbour.f = tempG + distance(neighbour, end);
                if (!openSet.includes(neighbour)) {
                    openSet.push(neighbour);
                }
            }
        }
        updateColor(current, openSet)
        await sleep(20);
    }
    console.log("Failed!")
    return false;
}

console.log(AStar());
