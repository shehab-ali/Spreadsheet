import { SpreadSheet } from "./SpreadSheet";
import { EvaluateExpression } from "./FormulaFunctions";
export class Cell {
  // This will be only field, then methods evaluate shown value
  // It does not make sense to have separate value for shown and formula, if you look
  // at a google spreadsheet, there is only one field that is modifiable, and that's the
  // formula value, then the spreadsheet just calculates and shows the shown value
  private value: string;
  // Spreadsheet it refers to
  private spreadsheet: SpreadSheet;
  private references: Cell[];

  constructor(initialValue: string = "", spreadsheet: SpreadSheet) {
    this.value = initialValue;
    this.spreadsheet = spreadsheet;
    this.references = [];
        
  }

  // Set the value of the cell, which is a formula or a raw value
  // getDisplayedValue() will parse the formula if there is one
  setValue(value: string): void {
    this.value = value;
  }

  // Get the displayed value (could be a formula result or the raw value)
  getDisplayedValue(): string {
    // if formula exists within value, evaluate and return it

    if (this.value.toString().startsWith("+")) {
      // Evaluate the formula if it exists
      return this.evaluateFormula(this.value.toString().slice(1));
    }
    return this.value;
  }

  // Get the raw value (which could be a formula or not)
  getRawValue(): string {
    return this.value;
  }

  // Evaluate a formula string
  private evaluateFormula(formula: string): string {
    const variables = this.spreadsheet.getCellTOValue();
    return EvaluateExpression(formula, variables, this.spreadsheet.cells);
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
  

  public checkCellReference(): boolean {
    const visitedCells = new Set<Cell>(); // Track visited cells
    return this.detectCycles(visitedCells); // Start cycle detection
  }
  
  private detectCycles(visitedCells: Set<Cell>): boolean {
    if (visitedCells.has(this)) {
      return true; // Cycle detected
    }
  
    visitedCells.add(this);
  
    // Check each referenced cell for cycles
    for (const referenceCell of this.references) {
      if (referenceCell.detectCycles(visitedCells)) {
        return true;
      }
    }
  
    visitedCells.delete(this); // Remove cell from visited cells
    return false; // No cycles found
  }
  
  /*
  public checkCellReference(): boolean {
    // First, identify all potential referenced cells and add them to the 'references' list
    for (let i = 0; i < this.spreadsheet.cells.length; i++) {
      const row = this.spreadsheet.cells[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const cellValue = String.fromCharCode('A'.charCodeAt(0) + j) + (i + 1);
    
        if (
          typeof cellValue === "string" &&
          cellValue.includes(this.getRawValue().toString())
        ) {
          this.references.push(cell);
        }
      }
    }

    // Perform a separate cycle detection pass
    for (const referenceCell of this.references) {
      if (referenceCell.detectCycles()) {
        //throw new Error("This is a cyclical reference.");
        return false;
      }
    }
    return true;
  }
  
  private detectCycles(): boolean {
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
  */
  
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
