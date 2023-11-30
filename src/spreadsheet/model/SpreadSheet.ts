import { Cell } from "./Cell";
import { EvaluateExpression } from "./FormulaFunctions";

//import { DecodeExcelCell } from "./FormulaFunctions";

export class SpreadSheet {
  name: string;
  id: string;
  users: number[];
  cells: Cell[][] = [];
  rows: number;
  cols: number;

  
  constructor(name: string, id: string, users: number[], rows :number, cols :number, cells?: Cell[][]) {
    
    this.name = name;
    this.id = id;
    this.users = users;
    this.rows = rows
    this.cols = cols

    if (typeof cells !== "undefined") {
      this.cells = cells;
    } else {
      this.cells = [];
      for (let i = 0; i < rows; i++) {
        this.cells[i] = [];
        for (let j = 0; j < cols; j++) {
          this.cells[i][j] = new Cell('',''); // Initialize each cell with a default value (e.g., 0)
        }
      }
    }
  }
  
  setCells(cells: Cell[][]) {
    this.cells = cells;
  }

  // Get a cell at a specific row and column
  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }

  //returns list of changed cells 
  setCellValue(cell: Cell, value: string): Cell[] {
    const updatedCells: Cell[] = [];
    const prevRawValue = cell.getRawValue(); // Store previous raw value
    
    cell.setRawValue(value);
    updatedCells.push(...this.updateDisplayedValue(cell)); // Update the modified cell
    
    // Check if the raw value has changed; if so, update referencing cells
    if (prevRawValue !== value) {
      const refCells = this.getReferencingCells(cell); // Get cells referencing the modified cell
      for (const ref of refCells) {
        updatedCells.push(...this.updateDisplayedValue(ref)); // Update referencing cells
      }
    }
    
    return updatedCells;
  }
  
  private updateDisplayedValue(cell: Cell): Cell[] {
    const [str, refList, err] = this.evaluateCell(
      cell.getRawValue(),
      this.getCellAddress(cell)
    );
    cell.setDisplayValue(str);
    if (err) cell.flagError();
    else cell.unflagError();
  
    const refCells = this.getCellsFromAddresses(refList);
    for (const ref of refCells) {
      const [updated] = this.evaluateCell(
        ref.getRawValue(),
        this.getCellAddress(ref)
      );
      ref.setDisplayValue(updated);
    }
  
    return refCells; // Return referencing cells for further updates
  }
  


  addCell(row: number, col: number, expression :string): Cell {
    const [str, refList, err] = this.evaluateCell(expression,this.getCellAddress(this.getCell(row,col)));
    this.cells[row][col] = new Cell(expression, str);
    if (err) this.cells[row][col].flagError();
    else this.cells[row][col].unflagError();
    return this.cells[row][col];
  }

  evaluateCell(expression :string, addr :string): [string, string[], boolean]{
    if (expression.trim().charAt(0) === '+') {
      expression = expression.replace(/^\+/, '');
      return EvaluateExpression(expression, this.getCellTOValue(), addr);
    }
    return [expression, [], false];
  }

  // Get the cell's address in A1 notation (e.g., "A1", "B2")
  getCellAddress(cell: Cell): string {
    const row = this.cells.findIndex((row) => row.includes(cell));
    const col = this.cells[row].indexOf(cell);
    const colLabel = String.fromCharCode("A".charCodeAt(0) + col);
    return colLabel + (row + 1);
  }

  // renames the spreadsheet to newName.
  rename(newName: string): void {
    this.name = newName;
  }

  // deletes row from spreadsheet
  deleteRow(rowNumber: number): void {
    if (rowNumber >= 0 && rowNumber < this.cells.length) {
      this.cells.splice(rowNumber, 1);
    }
  }

  // deletes column from spreadsheet
  deleteCol(colNumber: number): void {
    if (colNumber >= 0 && colNumber < this.cells[0].length) {
      for (let row = 0; row < this.cells.length; row++) {
        this.cells[row].splice(colNumber, 1);
      }
    }
  }

  // inserts row to spreadsheet
  insertRow(rowNumber: number): void {
    if (rowNumber >= 0 && rowNumber <= this.cells.length) {
      const newRow = new Array(this.cells[0].length);
      for (let i = 0; i < newRow.length; i++) {
        newRow[i] = new Cell("");
      }
      this.cells.splice(rowNumber, 0, newRow);
    }
  }

  // inserts column to spreadsheet
  insertCol(colNumber: number): void {
    if (colNumber >= 0 && colNumber <= this.cells[0].length) {
      for (let row = 0; row < this.cells.length; row++) {
        const newCell = new Cell("");
        this.cells[row].splice(colNumber, 0, newCell);
      }
    }
  }

  getNumRows(): number {
    return this.cells.length;
  }

  getNumCols(): number {
    if (this.cells.length === 0) {
      return 0;
    }
    return this.cells[0].length;
  }

  save(): void {}
  
  // Returns a map of each cell address to its displayed value. ex: { 'A6': 2, 'R3': 5}
  getCellTOValue(): Record<string, number | string> {
    const values: Record<string, number | string> = {};
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        values[this.getCellAddress(row[j])] = row[j].getDisplayedValue();
      }
    }
    return values;
    
  }
 
  private getCellsFromAddresses(refList: string[]): Cell[] {
    const cells: Cell[] = [];
  
    for (const ref of refList) {
      const cell = this.getCoordinates(ref);
      if (cell) {
        cells.push(cell);
      }
    }
  
    return cells;
  }

  private getCoordinates(str: string): Cell | undefined {
   
    const { row, column } = this.decodeExcelCell(str); // Function to decode cell reference to row and column
    if (row < 1 || column < 1) {
      return undefined; // Invalid cell address
    }
  
    // Check if the cell exists in the spreadsheet
    const numRows = this.getNumRows();
    const numCols = this.getNumCols();
    if (row > numRows || column > numCols) {
      return undefined; // Cell is out of bounds
    }
  
    // Get the cell at the specified coordinates
    return this.getCell(row - 1, column - 1); //` Adjusting 1-based indexing to 0-based indexing
  
  }

  private decodeExcelCell(cellReference: string): { row: number; column: number } {
    // Implement your decodeExcelCell function to extract row and column from cellReference
    // Example implementation (considering A1, B2, etc. references)
    const regex = /([A-Z]+)(\d+)/;
    const match = cellReference.match(regex);
  
    if (!match) {
      throw new Error("Invalid cell reference format");
    }
  
    const columnString = match[1];
    const rowString = match[2];
  
    // Convert column letters to column number
    let column = 0;
    for (let i = 0; i < columnString.length; i++) {
      const charCode = columnString.charCodeAt(i) - "A".charCodeAt(0) + 1;
      column = column * 26 + charCode;
    }
  
    const row = parseInt(rowString, 10);
  
    return { row, column };
  }

  private getReferencingCells(cell: Cell): Cell[] {
    const referencingCells: Cell[] = [];
  
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const currentCell = row[j];
        if (currentCell.getRawValue().includes(this.getCellAddress(cell))) {
          referencingCells.push(currentCell);
        }
      }
    }
  
    return referencingCells;
  }
  
 
}


