import { Cell } from "../model/Cell";
import { User } from "../model/User";
import fs from 'fs'

// WIP
export const writeSpreadsheet = (sheets: {cells: Cell[][], Name: string, Id: number, users: User[]}[]) => {
    let json = JSON.stringify(sheets);

    fs.writeFile('spreadsheets.json', json, (err: any) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
}