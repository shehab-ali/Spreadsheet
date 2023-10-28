import { SpreadSheet } from "./SpreadSheet";

export class FileManager {
    spreadsheets: SpreadSheet[];

    constructor() {
      this.spreadsheets = [];
    } 
  
    CreateSpreadSheet(name: string): SpreadSheet | undefined {
      return undefined;
    }
  
    DeleteSpreadSheet(id: number): void {}
    OpenSpreadsheet(id: number): SpreadSheet | undefined {
      return undefined;
    }
}