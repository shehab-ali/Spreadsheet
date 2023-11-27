import { Cell } from "./Cell";
import { SpreadSheet } from "./SpreadSheet";
import { User } from "./User";

// Purpose of this class is to add more details for the purpose of display in the view, without changing the model.
export class SpreadSheetWrapper extends SpreadSheet {
    isSelected: boolean = false;
    isHidden: boolean = false;

    constructor(cells: Cell[][], name: string, id: number, users: User[], isSelected?: boolean) {
        super(name, id, users, cells);
    }

    setSelected(value: boolean): void {
        this.isSelected = value;
      }

    setHidden(value: boolean): void {
        this.isHidden = value;
    }
}