import { Cell } from "./Cell";
import { User } from "./User";

export class SpreadSheet {
    cells: Cell[][];
    name: string;
    id: number;
    users: User[];

    constructor(cells?: Cell[][], name?: string, id?: number, users?: User[]) {
      this.cells = cells ? cells : [];
      this.name = name ? name : "";
      this.id = id ? id : 0;
      this.users = users ? users : [];
    }
  
    SearchCells(query: string): Cell[] {
      return [];
    }

  
    rename(newName: string): void {}
    save(): void {}
    deleteRow(rowNumber: number): void {}
    deleteCol(colNumber: number): void {}
    insertRow(rowNumber: number): void {}
    insertCol(colNumber: number): void {}
    getCell(cell: Cell): Cell | undefined {
      return undefined;
    }
}
  