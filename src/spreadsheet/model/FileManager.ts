import { SpreadSheet } from "./SpreadSheet";

export class FileManager {
    spreadsheets: SpreadSheet[];

    constructor() {
      this.spreadsheets = [];
    } 
  
    // check init condition of users 
    // Creates a new spreadsheet and adds it to the FileManager's spreadsheets list.
    CreateSpreadSheet(name: string): SpreadSheet | undefined {
      const s = new SpreadSheet(name, this.spreadsheets.length + 1 , []);
      this.spreadsheets.push(s);
      return s;
    }
  
    // Deletes a spreadsheet from the FileManager's spreadsheets list by ID.
    DeleteSpreadSheet(id: number): void {
      
      const spreadsheetIndex = this.spreadsheets.findIndex((spreadsheet) => spreadsheet.id === id);

      if (spreadsheetIndex === -1) {
          //If spreadsheet doesn't exist throw error
          throw new Error('Spreadsheet with the specified ID not found');
      } else {
        // If the spreadsheet with the specified ID exists, remove it from the array
        this.spreadsheets.splice(spreadsheetIndex, 1);
      }
    }

    // Opens a spreadsheet from the FileManager's spreadsheets list by ID.
    OpenSpreadsheet(id: number): SpreadSheet | undefined {
      const foundSpreadsheet = this.spreadsheets.find((spreadsheet) => spreadsheet.id === id);

      if (!foundSpreadsheet) {
          throw new Error('Spreadsheet with the specified ID not found');
      }

      return foundSpreadsheet;

    }
}