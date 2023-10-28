import { SpreadSheet } from "../model/SpreadSheet";

export class SpreadsheetController {
    processInputs(request: any): void {}
  
    createModel(inputs: any): SpreadSheet {
      return new SpreadSheet();
    }
  
    updateUI(model: SpreadSheet): void {}
}