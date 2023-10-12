
class User {
    ID: number;
    Name: string;
    readWrite: SpreadSheet[];
    readOnly: SpreadSheet[];
  
    AddReadWrite(spreadsheet: SpreadSheet): void {}
    RemoveReadWrite(spreadsheet: SpreadSheet): void {}
    AddReadOnly(spreadsheet: SpreadSheet): void {}
    RemoveReadOnly(spreadsheet: SpreadSheet): void {}
}
  