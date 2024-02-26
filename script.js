const spreadsheetContainer = document.querySelector("#spreadsheet-container")
const ROWS = 10
const COLS = 10
const spreadsheet = []
const exportBtn = document.querySelector("#export-btn")


class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false){
        this.isHeader = isHeader
        this.disabled = disabled
        this.data = data
        this.row = row
        this.rowName = rowName
        this.column = column
        this.columnName = columnName
        this.active = active
    }
}

const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N", 
    "O", 
    "P", 
    "Q", 
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

initSpreadsheet()

function initSpreadsheet(){
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = []
        for (let j = 0; j < COLS; j++) {
            let cellData = ""
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            

            if (i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            if (!cellData) {
                cellData = "";
            }
            const rowName = i;
            const columnName = alphabets[j - 1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false)
            spreadsheetRow.push(cell)
        }
        spreadsheet.push(spreadsheetRow)
    }
    drawSheet();
    console.log("spreadsheet", spreadsheet)

}

function createCellElement(cell) {
    const cellElement = document.createElement("input");
    cellElement.className = "cell"
    cellElement.id = "cell_" + cell.row + cell.column
    cellElement.value = cell.data
    cellElement.disabled = cell.disabled

    if (cell.isHeader) {
        cellElement.classList.add("header");
    }

    cellElement.onclick = () => handleCellClick(cell);
    cellElement.onchange = (e) => handleOnChange(e.target.vluae, cell)

    return cellElement
} 

function handleCellClick(cell){
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0]
    const columnHeaderElement = getElementFromRowCol(columnHeader.row, columnHeader.column)
    const rowHeaderElement = getElementFromRowCol(rowHeader.row, rowHeader.column)
   
    columnHeaderElement.classList.add('active')
    rowHeaderElement.classList.add('active')
    document.querySelector('#cell-status').innerHTML = cell.columnName + "" + cell.rowName;
}

function getElementFromRowCol(row, col) {
    return document.querySelector('#cell_' + row + col)
}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++){
        const rowContainerElement = document.createElement("div");
        rowContainerElement.className = "cell-row";

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j]
            rowContainerElement.append(createCellElement(cell));
        }
        spreadsheetContainer.append(rowContainerElement);
    }
}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll('.header')

    headers.forEach((header) => {
        header.classList.remove("active");
    });
}

exportBtn.onclick = function (e) {
    let csv = ""
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv += 
        spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n"
    }

    const csvObject = new Blob([csv])
    const csvUrl = URL.createObjectURL(csvObject)
    console.log("csv", csvUrl)

    const a = document.createElement('a')
    a.href = csvUrl
    a.download = "Spreadsheet File Name.csv"
    a.click()
}

function handleOnChange(data, cell) {
    cell.data = data
}

