import { SpreadSheet } from "./SpreadSheet";
import { EvaluateExpression } from "./FormulaFunctions";
export class Cell {
  // This will be only field, then methods evaluate shown value
  // It does not make sense to have separate value for shown and formula, if you look
  // at a google spreadsheet, there is only one field that is modifiable, and that's the
  // formula value, then the spreadsheet just calculates and shows the shown value
  private value: string | number;
  // Spreadsheet it refers to
  private spreadsheet: SpreadSheet;
  private references: Cell[];

  constructor(initialValue: number | string = "", spreadsheet: SpreadSheet) {
    this.value = initialValue;
    this.spreadsheet = spreadsheet;
    this.references = []
  }

  // Set the value of the cell, which is a formula or a raw value
  // getDisplayedValue() will parse the formula if there is one
  setValue(value: number | string): void {
    this.value = value;
  }

  // Get the displayed value (could be a formula result or the raw value)
  getDisplayedValue(): number | string {
    // if formula exists within value, evaluate and return it

    if (this.value.toString().startsWith('+')) {
      // Evaluate the formula if it exists
      return this.evaluateFormula(this.value.toString().slice(1));
    }
    return this.value;
  }

  // Get the raw value (which could be a formula or not)
  getRawValue(): number | string {
    return this.value;
  }

  // Evaluate a formula string
  private evaluateFormula(formula: string): number | string {
    const variables = this.spreadsheet.getCellTOValue();
    return EvaluateExpression(formula, variables, this.spreadsheet.cells)
  }

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

   getCellAddress(): string {
     // need to implement
      return this.spreadsheet.getCellAddress(this);
   }

   private checkCellReference(): void {
    // First, identify all potential referenced cells and add them to the 'references' list
    for (const row of this.spreadsheet.cells) {
      for (const cell of row) {
        const cellValue = cell.getCellAddress();
  
        if (typeof cellValue === 'string' && cellValue.includes(this.getRawValue().toString())) {
          this.references.push(cell);
        }
      }
    }
  
    // Perform a separate cycle detection pass
    for (const referenceCell of this.references) {
      if (referenceCell.detectCycles()) {
        throw new Error("This is a cyclical reference.");
      }
    }
  }

  public detectCycles(): boolean {
    // Create a set to track visited cells
    const visitedCells = new Set<Cell>();
  
    // Call the recursive helper function to check for cycles
    return this.detectCyclesHelper(visitedCells);
  }
  
  private detectCyclesHelper(visitedCells: Set<Cell>): boolean {
    // Check if the cell has already been visited
    if (visitedCells.has(this)) {
      return true; // Cycle detected
    }
  
    // Add the cell to the visited cells set
    visitedCells.add(this);
  
    // Check if any referenced cells have cycles
    for (const referenceCell of this.references) {
      if (referenceCell.detectCyclesHelper(visitedCells)) {
        return true;
      }
    }
  
    // No cycles found
    return false;
  }
   

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
