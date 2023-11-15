import { SpreadSheet } from "./SpreadSheet";
import { EvaluateExpression } from "./FormulaFunctions";
export class Cell {
    // Shown value
    private value: number | string;
    // Formula written by user
    private formula: string | null;
    // Spreadsheet it refers to
    // private spreadsheet: SpreadSheet;

    constructor(initialValue: number | string  = '') {
      this.value = initialValue;
      this.formula = null;
      // this.spreadsheet = spreadsheet;
    }

    // Set the value of the cell
    setValue(value: number | string): void {
      this.value = value;
      this.formula = null;
    }

    // Get the displayed value (could be a formula result or the raw value)
    getDisplayedValue(): number | string {
      if (this.formula) {
        // Evaluate the formula if it exists
        return this.evaluateFormula(this.formula);
      }
      return this.value;
    }

    // Set a formula for the cell
    setFormula(formula: string): void {
      this.formula = formula;
    }

    // Evaluate a formula string
    private evaluateFormula(formula: string): number | string {
      const variables = { A6: 10, X7: 5 };
      return EvaluateExpression(formula, variables)
    }

      
    
      private isNumeric(value: string): boolean {
        return /^-?\d*(\.\d+)?$/.test(value);
      }
        /*
    // Reference another cell in this cell's formula
    referenceCell(cell: Cell): void {
        const cellAddress = this.spreadsheet.getCellAddress(cell);
        if (this.formula) {
            this.formula += ` ${cellAddress}`;
        } else {
            this.formula = cellAddress;
        }
    }
    */


}
