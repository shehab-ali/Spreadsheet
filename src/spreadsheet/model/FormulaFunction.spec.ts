import { EvaluateExpression } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
  it("should correctly evaluate basic arithmetic expressions", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "2 + 3 * 4 / 2 - 1";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('7');
  });
});  