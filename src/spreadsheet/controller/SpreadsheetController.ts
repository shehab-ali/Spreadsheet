import { SpreadSheet } from "../model/SpreadSheet";

export class SpreadsheetController {
    processInputs(request: any): void {}
  
    createModel(inputs: any): SpreadSheet {
      return new SpreadSheet('', 0, [], []);
    }
  
    updateUI(model: SpreadSheet): void {}
}