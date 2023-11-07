import { Cell } from "./Cell";
import { User } from "./User";

export class SpreadSheet {
    name: string;
    id: number;
    users: User[];
    private cells: Cell[][];

    functions: { [key: string]: (numbers: number[]) => number } = {
      '+': (numbers) => numbers.reduce((a, b) => a + b, 0),
      '-': (numbers) => numbers.reduce((a, b) => a - b),
      '*': (numbers) => numbers.reduce((a, b) => a * b, 1),
      '/': (numbers) => {
        if (numbers.length < 2 || numbers[1] === 0) {
          return 'Error: Division by zero or invalid arguments';
        }
        return numbers.reduce((a, b) => a / b);
      },
      'SUM': (numbers) => numbers.reduce((a, b) => a + b, 0),
      'AVERAGE': (numbers) => {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b) / numbers.length;
      },
      'COUNT': (numbers) => numbers.length,
      'MIN': (numbers) => Math.min(...numbers),
      'MAX': (numbers) => Math.max(...numbers),
    };
  
    constructor(rows: number, cols: number, name: string, id: number, users: User[]) {
      this.cells = new Array(rows);
      this.name = name;
      this.id = id;
      this.users = users;
      for (let i = 0; i < rows; i++) {
        this.cells[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
          this.cells[i][j] = new Cell(this);
        }
      }
    }
  
    // Get a cell at a specific row and column
    getCell(row: number, col: number): Cell {
      return this.cells[row][col];
    }
  
    // Get the cell's address in A1 notation (e.g., "A1", "B2")
    getCellAddress(cell: Cell): string {
      const row = this.cells.findIndex((row) => row.includes(cell));
      const col = this.cells[row].indexOf(cell);
      const colLabel = String.fromCharCode('A'.charCodeAt(0) + col);
      return colLabel + (row + 1);
    }
  

  
    rename(newName: string): void {}
    save(): void {}
    deleteRow(rowNumber: number): void {}
    deleteCol(colNumber: number): void {}
    insertRow(rowNumber: number): void {}
    insertCol(colNumber: number): void {}

}
  