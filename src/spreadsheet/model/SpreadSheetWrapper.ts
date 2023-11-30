import { Cell } from "./Cell";
import { SpreadSheet } from "./SpreadSheet";
import { User } from "./User";

// Purpose of this class is to add more details for the purpose of display in the view, without changing the model.
export class SpreadSheetWrapper extends SpreadSheet {
  isSelected: boolean = false;
  isHidden: boolean = false;

  constructor(
    name: string,
    id: string,
    users: number[],
    rows: number,
    cols: number,
    isSelected?: boolean,
    cells?: Cell[][]
  ) {
    super(name, id, users, rows, cols, cells);
  }

  setSelected(value: boolean): void {
    this.isSelected = value;
  }

  setHidden(value: boolean): void {
    this.isHidden = value;
  }
}
