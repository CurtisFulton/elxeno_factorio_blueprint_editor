var gridCanvas = document.getElementById("grid");
var dynamicCanvas = document.getElementById("dynamic-content");

// For some reason the inner width/height is just a little too big (Causing scroll bars)
var windowWidth = window.innerWidth - 10;
var windowHeight = window.innerHeight - 10;

var numRows = 25;
var numColumns = 25;

var prevMouseGridPos;
var squareSize = 0;

var gridContext = gridCanvas.getContext('2d');
var dynamicContext = dynamicCanvas.getContext('2d');

init();

function init() {
    var width = windowWidth;
    var height = windowHeight;

    // Set up the canvas'
    squareSize = Math.min(Math.floor(width / numColumns), Math.floor(height / numRows));

    gridCanvas.width = squareSize * numColumns;
    gridCanvas.height = squareSize * numRows;

    dynamicCanvas.width = squareSize * numColumns;
    dynamicCanvas.height = squareSize * numRows;

    drawGrid();
    //animationLoop();

    document.addEventListener('mousemove', onMouseMove);
}

function drawGrid() {
    gridContext.beginPath();


    for (var x = 0; x <= numColumns; x++) {
        gridContext.moveTo(x * squareSize, 0);
        gridContext.lineTo(x * squareSize, gridCanvas.height);
    }

    for (var y = 0; y <= numRows; y++) {
        gridContext.moveTo(0, y * squareSize);
        gridContext.lineTo(gridCanvas.width, y * squareSize);
    }

    gridContext.stroke();
}

function onMouseMove(mousePos) {
    var gridPos = getGridFromCoordinates(mousePos.pageX, mousePos.pageY);

    // If the mouse has moved to a different grid pos
    if (gridPos != prevMouseGridPos) {
        // Clear the old selection box
        clearSquare(dynamicContext, prevMouseGridPos);

        drawSelectionSquare(dynamicContext, gridPos);

        prevMouseGridPos = gridPos;
    }
}

function clearSquare(context, gridPos) {
    if (gridPos == null)
        return;

    var x = gridPos.mouseX * squareSize;
    var y = gridPos.mouseY * squareSize;

    context.clearRect(x, y, squareSize, squareSize);
}

function drawSelectionSquare(context, gridPos) {
    var x = gridPos.mouseX * squareSize;
    var y = gridPos.mouseY * squareSize;

    context.beginPath();
    context.moveTo(x + 1, y + 1);
    context.lineTo(x - 1 + squareSize, y + 1);
    context.lineTo(x - 1 + squareSize, y - 1 + squareSize);
    context.lineTo(x + 1, y - 1 + squareSize);
    context.lineTo(x + 1, y + 1);

    context.strokeStyle = '#d2d200';
    context.stroke();
    context.strokeStyle = '#000000';
}

function animationLoop() {

    requestAnimationFrame(animationLoop);
}

// Used to convert real coordinates to a grid coordinate
function getGridFromCoordinates(x, y) {
    var rect = gridCanvas.getBoundingClientRect();
    var relX = x - rect.left;
    var relY = y - rect.top;

    var x = Math.floor((relX / gridCanvas.width) * numColumns);
    var y = Math.floor((relY / gridCanvas.height) * numRows);

    return {
        mouseX : x,
        mouseY : y,
    }
}
