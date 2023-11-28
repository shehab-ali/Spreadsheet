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
  

    AddReadWrite(s: SpreadSheet): void {
        this.readWrite.push(s)
    }

    RemoveReadWrite(spreadsheet: SpreadSheet): void {
      
        if(this.readWrite.some((sheet) => sheet.id === spreadsheet.id)){
            this.readWrite = this.readWrite.filter((sheet) => sheet.id !== spreadsheet.id);      
        } else {
            throw new Error('User does not have read-write access to this spreadsheet');
        }
    }
    
    AddReadOnly(s: SpreadSheet): void {
        this.readOnly.push(s)
    }

    RemoveReadOnly(spreadsheet: SpreadSheet): void {
        if(this.readOnly.some((sheet) => sheet.id === spreadsheet.id)){
            this.readOnly = this.readOnly.filter((sheet) => sheet.id !== spreadsheet.id);      
        } else {
            throw new Error('User does not have read-write access to this spreadsheet');
        }
    }

    CheckPermissions(): String {
        const permissions: string[] = [];

        this.readWrite.forEach((sheet) => {
            permissions.push(`Read-Write permission for ${sheet.name}`);
        });

        this.readOnly.forEach((sheet) => {
            permissions.push(`Read-Only permission for ${sheet.name}`);
        });

        return permissions.length > 0 ? permissions.join('\n') : 'No permissions';
    }

    }

  