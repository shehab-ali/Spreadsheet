import { SpreadSheet } from "./SpreadSheet";

export class FileManager {
  spreadsheets: SpreadSheet[];

  constructor() {
    this.spreadsheets = [];
  }

  // check init condition of users
  // Creates a new spreadsheet and adds it to the FileManager's spreadsheets list.
  CreateSpreadSheet(name: string, id: string): SpreadSheet | undefined {
    const s = new SpreadSheet(name, id, []);
    this.spreadsheets.push(s);
    return s;
  }

  // Deletes a spreadsheet from the FileManager's spreadsheets list by ID.
  DeleteSpreadSheet(id: string): void {
    const spreadsheetIndex = this.spreadsheets.findIndex(
      (spreadsheet) => spreadsheet.id === id
    );

    if (spreadsheetIndex === -1) {
      //If spreadsheet doesn't exist throw error
      throw new Error("Spreadsheet with the specified ID not found");
    } else {
      // If the spreadsheet with the specified ID exists, remove it from the array
      this.spreadsheets.splice(spreadsheetIndex, 1);
    }
  }

  // Opens a spreadsheet from the FileManager's spreadsheets list by ID.
  OpenSpreadsheet(id: string): SpreadSheet | undefined {
    const foundSpreadsheet = this.spreadsheets.find(
      (spreadsheet) => spreadsheet.id === id
    );

    if (!foundSpreadsheet) {
      throw new Error("Spreadsheet with the specified ID not found");
    }

    return foundSpreadsheet;
  }

  // return a string containing the names and ids of all existing spreadsheets in the File Manager
  getSpreadsheetsInfo(): String {
    const info: string[] = this.spreadsheets.map(
      (spreadsheet) => `${spreadsheet.name} (ID: ${spreadsheet.id})`
    );
    return info.join("\n");
  }
}
