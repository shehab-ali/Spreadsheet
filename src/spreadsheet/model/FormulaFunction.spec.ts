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

  it("Should evaluate correctly with cell reference", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "A1 + B2";    

    const c1 = s.addCell(0,0,'10');
    const c2 = s.addCell(0,1,'8');
    const c3 = s.addCell(1,0,'3');
    const c4 = s.addCell(1,1,'40');
    const c5 = s.addCell(1,2, expression);
 
    expect(c5.getDisplayedValue()).toBe('50');
  });

  
});  