import { SpreadSheet } from "./SpreadSheet";
import { EvaluateExpression } from "./FormulaFunctions";
export class Cell {
   private rawValue: string;
  private displayValue: string;

  constructor(rawValue: string = "", displayValue: string = "") {
    this.rawValue = rawValue;
    this.displayValue = displayValue;
  }

  // Set the value of the cell, which is a formula or a raw value
  // getDisplayedValue() will parse the formula if there is one
  setRawValue(value: string): void {
    this.rawValue = value;
  }

  setDisplayValue(value: string): void {
    this.displayValue = value;
  }
  // Get the displayed value (could be a formula result or the raw value)
  getDisplayedValue(): string {
    // if formula exists within value, evaluate and return it
    return this.displayValue;
  }

  // Get the raw value (which could be a formula or not)
  getRawValue(): string {
    return this.rawValue;
  }

 }