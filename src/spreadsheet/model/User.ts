import { SpreadSheet } from "./SpreadSheet";
export class User {
    ID: number;
    name: string;
    readWrite: SpreadSheet[];
    readOnly: SpreadSheet[];

    constructor() {
        this.name = "";
        this.readOnly = [];
        this.readWrite = [];
        this.ID = 0;
    }
  
    AddReadWrite(spreadsheet: SpreadSheet): void {}
    RemoveReadWrite(spreadsheet: SpreadSheet): void {}
    AddReadOnly(spreadsheet: SpreadSheet): void {}
    RemoveReadOnly(spreadsheet: SpreadSheet): void {}
}
  