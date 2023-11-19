import { Cell } from "./Cell";
import { User } from "./User";
import { DecodeExcelCell } from "./FormulaFunctions";

export class SpreadSheet {
  name: string;
  id: number;
  users: User[];
  public cells: Cell[][];

  constructor(cells: Cell[][], name: string, id: number, users: User[]) {
    this.cells = cells;
    this.name = name;
    this.id = id;
    this.users = users;
  }

  // Get a cell at a specific row and column
  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
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
        newRow[i] = new Cell();
      }
      this.cells.splice(rowNumber, 0, newRow);
    }
  }

  // inserts column to spreadsheet
  insertCol(colNumber: number): void {
    if (colNumber >= 0 && colNumber <= this.cells[0].length) {
      for (let row = 0; row < this.cells.length; row++) {
        const newCell = new Cell();
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
    const values: Record<string, number> = {};
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        values[this.getCellAddress(row[j])] = Number(
          row[j].getDisplayedValue()
        );
      }
    }
    return values;
  }
}
