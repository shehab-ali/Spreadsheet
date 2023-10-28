import { SpreadSheet } from "../model/SpreadSheet";

export class SpreadsheetView {
    model: SpreadSheet;

    constructor(model: SpreadSheet) {  
        this.model = new SpreadSheet();
    };
  
    renderModel(): void {}
}
  