import { SpreadSheet } from "./SpreadSheet";
import { EvaluateExpression } from "./FormulaFunctions";
export class Cell {
    // Shown value
    private value: number | string;
    // Formula written by user
    private formula: string | null;
    // Spreadsheet it refers to
    // private spreadsheet: SpreadSheet;
    // private references: Cell[];

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
      // if (this.formula) {
      //   // Evaluate the formula if it exists
      //   return this.evaluateFormula(this.formula);
      // }
      return this.value;
    }

    // Set a formula for the cell
    setFormula(formula: string): void {
      this.formula = formula;
    }

    // Evaluate a formula string
    // private evaluateFormula(formula: string): number | string {
    //   const variables = this.spreadsheet.getCellTOValue();
    //   return EvaluateExpression(formula, variables)
    // }


    // private resolveReferences(formula: string): string {
    //   // Replace references in the formula with their values
    //   let resolvedFormula = formula;
    //   for (const referenceCell of this.references) {
    //     const cellAddress = referenceCell.getCellAddress();
    //     const regex = new RegExp(cellAddress, 'g');
    //     resolvedFormula = resolvedFormula.replace(regex, referenceCell.getDisplayedValue().toString());
    //   }
    //   return resolvedFormula;
    // }
  
    // getCellAddress(): string {
    //   // need to implement
    //   return 'A1';
    // }
  
    // // New method to add references
    // addReference(cell: Cell): void {
    //   // Check for cyclic references
    //   if (this.detectCycles(cell)) {
    //     throw new Error('Cyclic reference detected!');
    //   }
  
    //   // Add the reference
    //   this.references.push(cell);
    // }
  
    // // Helper method to detect cycles using Depth-First Search (DFS)
    // private detectCycles(targetCell: Cell, visitedCells: Set<Cell> = new Set<Cell>()): boolean {
    //   if (visitedCells.has(this)) {
    //     return true; // Cyclic reference detected
    //   }
  
    //   visitedCells.add(this);
  
    //   for (const referenceCell of this.references) {
    //     if (referenceCell === targetCell || referenceCell.detectCycles(targetCell, visitedCells)) {
    //       return true; // Cyclic reference detected
    //     }
    //   }
  
    //   visitedCells.delete(this);
    //   return false; // No cycles detected
    // }


}
