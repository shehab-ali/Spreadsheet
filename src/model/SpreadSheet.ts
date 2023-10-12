class SpreadSheet {
    cells: Cell[][];
    Name: string;
    Id: number;
    users: User[];
  
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
  