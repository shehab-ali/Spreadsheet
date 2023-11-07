import { SpreadSheet } from "./SpreadSheet";
export class Cell {
    // Shown value
    private value: number | string;
    // Formula written by user
    private formula: string | null;
    // Spreadsheet it refers to
    private spreadsheet: SpreadSheet;

    constructor(spreadsheet: SpreadSheet, initialValue: number | string = '') {
        this.value = initialValue;
        this.formula = null;
        this.spreadsheet = spreadsheet;
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
        try {
          // Split the formula by whitespace to parse individual elements
          const elements = formula.split(/\s+/);
    
          let result = 0;
          let numbers: number[] = [];
    
          for (const element of elements) {
            if (!element) continue;
    
            if (this.isNumeric(element)) {
              // If the element is a number, store it for later computation
              numbers.push(parseFloat(element));
            } else if (element in this.spreadsheet.functions) {
              // If the element is a supported function, apply it
              result = this.spreadsheet.functions[element](numbers);
              numbers = [result];
            } else {
              return 'Error: Invalid Formula';
            }
          }
    
          return result;
        } catch (error) {
          return 'Error: Invalid Formula';
        }
      }
    
      private isNumeric(value: string): boolean {
        return /^-?\d*(\.\d+)?$/.test(value);
      }

    // Reference another cell in this cell's formula
    referenceCell(cell: Cell): void {
        const cellAddress = this.spreadsheet.getCellAddress(cell);
        if (this.formula) {
            this.formula += ` ${cellAddress}`;
        } else {
            this.formula = cellAddress;
        }
    }










    // public Solve(hiddenValue: any, cells: Cell[][]): void {
    //     return this.getValue();
    // }
    // public getValue(): any {
    //     return this.shownValue;
    // }



}
